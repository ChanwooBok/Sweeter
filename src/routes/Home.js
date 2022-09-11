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
import SweetFactory from "components/SweetFactory";

const Home = ({ userObj }) => {
  const [sweets, setSweets] = useState([]); // 모든 트윗을 화면에 띄우기 위함.
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
  // useEffect(() => {
  //   //getSweets();
  //   dbService.collection("sweets").onSnapshot((snapshot) => {
  //     const sweetArray = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setSweets(sweetArray);
  //   });
  //   console.log(sweets);
  // }, []);

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

  return (
    <div className="container">
      <SweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
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
