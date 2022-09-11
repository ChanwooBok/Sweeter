import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "./Sweet.module.css";

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
    <div className={styles.sweet}>
      {editing ? (
        <>
          <form onSubmit={onSubmit} className={styles.sweetEdit}>
            <input
              type="text"
              value={newSweet}
              placeholder="Edit your sweet"
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input
              type="submit"
              value="Update Sweet"
              className={styles.formBtn}
            />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{sweetObj.text}</h4>
          {sweetObj.attachmentUrl && (
            <img src={sweetObj.attachmentUrl} width={"50px"} height={"50px"} />
          )}
          {isOwner && (
            <div class={styles.sweet__actions}>
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Sweet;
