import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

import styles from "./SweetFactory.module.css";

const SweetFactory = ({ userObj }) => {
  const [sweet, setSweet] = useState(""); // 트윗을 작성하기 위함.
  const [attachMent, setAttachMent] = useState("");

  const onSubmit = async (e) => {
    if (sweet === "") {
      return;
    }
    e.preventDefault();
    /* 트윗 업로드는 나중에 , 우선 사진을 업로드 후, 트윗에 사진주소를 저장할것임.
        await dbService.collection("sweets").add({
          text: sweet,
          createdAt: Date.now(),
          creatorId: userObj.uid,
        });
        setSweet("");
        */
    // A Reference represents a specific location in your Database and can be used for reading or writing data to that Database location.
    //  : https://firebase.google.com/docs/reference/js/v8/firebase.storage.Reference

    //file Upload : https://firebase.google.com/docs/storage/web/upload-files
    //To upload a file to Cloud Storage, you first create a reference to the full path of the file, including the file name.
    // Upload from a String : You can use the uploadString() method to upload a raw, base64, base64url, or data_url encoded string to Cloud Storage.
    let attachmentUrl = ""; // for those who doesn't upload photo when tweeting
    if (attachMent != "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachMent,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(ref(storageService, attachmentRef)); // Getting a public url
    }

    // making a new sweet
    const sweetObj = {
      text: sweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("sweets").add(sweetObj);
    setSweet(""); //initializing
    setAttachMent("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setSweet(value);
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    //console.log(files); // FileList {0: File, length: 1}
    //console.log(files[0]); // File {name: 'IMG_6645.JPG', lastModified: 1651070149000, lastModifiedDate: Wed Apr 27 2022 23:35:49 GMT+0900 (Korean Standard Time), webkitRelativePath: '', size: 178819, …}lastModified: 1651070149000lastModifiedDate: Wed Apr 27 2022 23:35:49 GMT+0900 (Korean Standard Time) {}name: "IMG_6645.JPG"size: 178819type: "image/jpeg"webkitRelativePath: ""[[Prototype]]: File
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachMent(result);
    };
    reader.readAsDataURL(theFile); // getting data_url from files by this code.
  };

  const onClearAttachment = () => {
    setAttachMent("");
  };

  return (
    <form onSubmit={onSubmit} className={styles.factoryForm}>
      <div className={styles.factoryInput__container}>
        <input
          className={styles.factoryInput__input}
          type="text"
          value={sweet}
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input
          type="submit"
          value="Sweet"
          className={styles.factoryInput__arrow}
        />
      </div>
      <label htmlFor="attach-file" className={styles.factoryInput__label}>
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachMent && (
        <div className={styles.factoryForm__attachment}>
          <img
            src={attachMent}
            style={{
              backgroundImage: attachMent,
            }}
          />
          <div
            className={styles.factoryForm__clear}
            onClick={onClearAttachment}
          >
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default SweetFactory;
