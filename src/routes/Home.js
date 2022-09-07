import { dbService, storageService } from "fbase";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Sweet from "components/Sweet";

import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const Home = ({ userObj }) => {
  const [sweet, setSweet] = useState(""); // 트윗을 작성하기 위함.
  const [sweets, setSweets] = useState([]); // 모든 트윗을 화면에 띄우기 위함.
  const [attachMent, setAttachMent] = useState("");
  /* 구 방식
    const getSweets = async() => {
        // Getting all documents in a collection
        //https://firebase.google.com/docs/firestore/query-data/get-data#web-version-9_5
        const dbSweets = await getDocs(collection(dbService,"sweets"));

        dbSweets.forEach( (potato) => {
            const sweetObject = {
                ...potato.data(),
                id:potato.id,
            }; // 데이터베이스에있는 트윗을 모두 가져다가 sweetObject에 넣어준다.
            setSweets( (prev) => [sweetObject , ...prev]); // 데이터베이스에있는 내용을 빈 배열 sweet에 넣어준다.
        });
        
    }
    */
  // < Getting realtime updates with Cloud Firestore 방법1.>
  //    useEffect( () => {
  //        //getSweets();
  //        dbService.collection("sweets").onSnapshot( (snapshot) => {
  //         const sweetArray = snapshot.docs.map( (doc) => ({
  //             id : doc.id,
  //             ...doc.data(),
  //         }));
  //         setSweets(sweetArray);
  //        });
  //        console.log(sweets);
  //    } , []);

  //< Getting realtime updates with Cloud Firestore 방법2.>
  useEffect(() => {
    const q = query(
      collection(dbService, "sweets"),
      orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
      const sweetArray = snapshot.docs.map((document) => ({
        // snapshot.docs is an array of data -> ex) console.log(snapshot.docs); :  (4) [$u, $u, $u, $u]
        id: document.id, // -> ex) r237bdqhfa947n19sdMm
        ...document.data(), // -> ex) {createdAt: 1662468209248, creatorId: 'iB39OzyIkLNIsfM1uVg3abpuqtf2', text: 'asdf'}
      }));
      setSweets(sweetArray); // -> console.log(sweetArray); : (4) [{…}, {…}, {…}, {…}] each element has an object which consist of text,createdAt,createId
    });
  }, []);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setSweet(value);
  };

  // A Reference represents a specific location in your Database and can be used for reading or writing data to that Database location.
  //  : https://firebase.google.com/docs/reference/js/v8/firebase.storage.Reference

  const onSubmit = async (e) => {
    e.preventDefault();
    /* 트윗 업로드는 나중에 , 우선 사진을 업로드 후, 트윗에 사진주소를 저장할것임.
    await dbService.collection("sweets").add({
      text: sweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setSweet("");
    */

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

  const onClearBtn = () => {
    setAttachMent("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={sweet}
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Sweet" />
        <input type="file" accept="image/*" onChange={onFileChange} />
        {attachMent && (
          <>
            <img src={attachMent} height={"50px"} width={"50px"} />
            <button onClick={onClearBtn}>Clear</button>
          </>
        )}
      </form>
      <div>
        {sweets.map((sweet) => (
          <Sweet
            key={sweet.id}
            sweetObj={sweet}
            isOwner={sweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
