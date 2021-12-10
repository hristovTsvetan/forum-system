import { useModal } from "../../hooks/useModal";
import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";

export default function PostEdit() {

    const [newPostName, setNewPostName] = useState('');
    const [currentTitle, setCurrentTitle] = useState('');
    const {editPostAction, itemId} = useModal();
    const {getDocument, updateDocument} = useFirestore('categories');
    
    useEffect(() => {

      const getData = async () => {
        if(itemId) {
          const curCategory = await getDocument(itemId.catId);
          const curSubCategory = curCategory.subCategories[itemId.subId];
          const curPost = curSubCategory.posts[itemId.id];

          setCurrentTitle(curPost.postTitle);
        }
        
      };

      getData();   

    }, [])


    const submitHandler = async (e) => {
      e.preventDefault();
      
      const curCategory = await getDocument(itemId.catId);
      const curPost = curCategory.subCategories[itemId.subId].posts[itemId.id];

      curPost.postTitle = newPostName;
      
      await updateDocument(itemId.catId, curCategory);

      editPostAction(false, null);

    };

    return (
        <form className="category-edit" onSubmit={submitHandler}>
        <label>
          <div>
            <span>Current post title:</span>
          </div>
          <div>
            <p>{currentTitle}</p>
          </div>
        </label>
        <label>
          <div>
            <span>New post title:</span>
          </div>
          <div>
            <input
              type="text"
              onChange={(e) => setNewPostName(e.currentTarget.value)}
              value={newPostName}
              required
            />
          </div>
        </label>
        <div className="modal-change-button-wrapper">
          <button className="modal-edit-chang-btn">Change</button>
          <button className="modal-edit-cancel-btn" onClick={() => editPostAction(false, null)}>Cancel</button>
        </div>
      </form>
    )
}
