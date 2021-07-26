import React, { useState, useEffect, Fragment, useContext } from 'react';
import firebase from './firebase';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from './auth/Auth';

function SnapshotFirebaseAdvanced() {
  const { currentUser } = useContext(AuthContext);
  const currentUserId = currentUser ? currentUser.uid : null;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [score, setScore] = useState('');

  const ref = firebase.firestore().collection('events');

  //REALTIME GET FUNCTION
  function getEvents() {
    setLoading(true);
    ref
      //.where('owner', '==', currentUserId)
      //.where('title', '==', 'School1') // does not need index
      //.where('score', '<=', 10)    // needs index
      //.orderBy('owner', 'asc')
      //.limit(3)
      .onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        });
        setEvents(items);
        setLoading(false);
      });
  }

  useEffect(() => {
    getEvents();
    // eslint-disable-next-line
  }, []);

  // ADD FUNCTION
  function addEvent() {
    const owner = currentUser ? currentUser.uid : 'unknown';
    const ownerEmail = currentUser ? currentUser.email : 'unknown';
    const newEvent = {
      title,
      desc,
      score: +score,
      id: uuidv4(),
      owner,
      ownerEmail,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
    };

    ref
      .doc(newEvent.id)
      .set(newEvent)
      .catch((err) => {
        console.error(err);
      });
  }

  //DELETE FUNCTION
  function deleteEvent(event) {
    ref
      .doc(event.id)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  }

  // EDIT FUNCTION
  function editEvent(event) {
    const updatedEvent = {
      score: +score,
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
    };
    setLoading();
    ref
      .doc(event.id)
      .update(updatedEvent)
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <Fragment>
      <h1>Schools (SNAPSHOT adv.)</h1>
      <div className="inputBox">
        <h3>Add New</h3>
        <h6>Title</h6>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <h6>Score 0-10</h6>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <h6>Description</h6>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
        <button onClick={() => addEvent()}>Submit</button>
      </div>
      <hr />
      {loading ? <h1>Loading...</h1> : null}
      {events.map((event) => (
        <div className="school" key={event.id}>
          <h2>{event.title}</h2>
          <p>{event.desc}</p>
          <p>{event.score}</p>
          <p>{event.ownerEmail}</p>
          <div>
            <button onClick={() => deleteEvent(event)}>X</button>
            <button onClick={() => editEvent(event)}>Edit Score</button>
          </div>
        </div>
      ))}
    </Fragment>
  );
}

export default SnapshotFirebaseAdvanced;
