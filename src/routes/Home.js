import { dbService } from 'fbase';
import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";

const Home = ( { userObj }) => {
    const [sweet , setSweet ] = useState(""); // 트윗을 작성하기 위함.
    const [ sweets , setSweets ] = useState([]); // 모든 트윗을 화면에 띄우기 위함.

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

    useEffect(() => {
        const q = query(
        collection(dbService, "sweets"),
        orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
        const sweetArray = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
        }));
        setSweets(sweetArray);
        });
        }, []);

    const onChange = (e) => {
        const { target : {value }} = e;
        setSweet(value);
    };

    const onSubmit = async(e) => {
        e.preventDefault();
        await dbService.collection("sweets").add({
            text : sweet,
            createdAt : Date.now(),
            creatorId: userObj.uid,
        });
        setSweet("");
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
                <input type="submit" value="Sweet"/>
            </form>
            <div>
                {sweets.map( (sweet) => (
                    <div key={sweet.id}>
                        <h4>{sweet.text}</h4>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home;
