import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Sweet = ({ key, sweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newSweet, setNewSweet] = useState(sweetObj.text);

  //sweet Ref
  const SweetTextRef = doc(dbService, "sweets", `${sweetObj.id}`);
  // storage Ref ( img file )
  const storageRef = ref(storageService, sweetObj.attachmentUrl);

  //Deleting documents : https://firebase.google.com/docs/firestore/manage-data/delete-data
  const onDeleteClick = async () => {
    const ok = window.confirm("are you sure you want to delete ? ");
    if (ok) {
      await deleteDoc(SweetTextRef);
      if (sweetObj.attachmentUrl !== "") {
        await deleteObject(storageRef);
      }
    }
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewSweet(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    //Updating fields in nested objects : https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
    await updateDoc(SweetTextRef, {
      text: newSweet,
    });
    setEditing(false);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input type="text" value={newSweet} onChange={onChange} required />
            <input type="submit" value="Update Sweet" />
          </form>
        </>
      ) : (
        <>
          <h4>{sweetObj.text}</h4>
          {sweetObj.attachmentUrl && (
            <img src={sweetObj.attachmentUrl} width={"50px"} height={"50px"} />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Sweet;
