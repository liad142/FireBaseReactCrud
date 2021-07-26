import React, { useState, useEffect, Fragment } from "react";
import firebase from "./firebase";
import { v4 as uuidv4 } from "uuid";

function SnapshotFirebase() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const ref = firebase.firestore().collection("events");

  //REALTIME GET FUNCTION
  function getEvents() {
    setLoading(true);
    ref.onSnapshot((querySnapshot) => {
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
  function addEvent(newEvent) {
    ref
      //.doc() use if for some reason you want that firestore generates the id
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
  function editEvent(updatedEvent) {
    setLoading();
    ref
      .doc(updatedEvent.id)
      .update(updatedEvent)
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <Fragment>
      <h1>events (SNAPSHOT)</h1>
      <div className="inputBox">
        <h3>Add New</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
        <button onClick={() => addEvent({ title, desc, id: uuidv4() })}>
          Submit
        </button>
      </div>
      <hr />
      {loading ? <h1>Loading...</h1> : null}
      {events.map((event) => (
        <div className="school" key={event.id}>
          <h2>{event.title}</h2>
          <p>{event.desc}</p>
          <div>
            <button onClick={() => deleteEvent(event)}>X</button>
            <button
              onClick={() =>
                editEvent({ title: event.title, desc, id: event.id })
              }
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </Fragment>
  );
}

export default SnapshotFirebase;
