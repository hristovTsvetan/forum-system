import { useHistory, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { timestamp } from '../../firebase/config';
import { useUser } from '../../hooks/useUser';
import Path from '../Path/Path';
import uniqid from 'uniqid';
import { useTitle } from '../../hooks/useTitle';

import './CreatePost.css';


export default function CreatePost() {
    const [categoryName, setCategoryName] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');
    const [postTile, setPostTitle] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const {categoryid, subcategoryid} = useParams();
    const {getDocument, updateDocument, response} = useFirestore('categories');
    const {user} = useUser();
    const history = useHistory();
    useTitle('Honda forum - create post');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const curDocument = await getDocument(categoryid);

        const postId = uniqid();
        const commentId = uniqid();
        const createdAt = timestamp.fromDate(new Date());

        const newPost = { [postId]: {
            id: postId,
            subCategoryId: subcategoryid,
            categoryId: categoryid,
            createdAt,
            postTitle: postTile,
            uid: user.uid,
            comments: {
                [commentId]: {
                    createdAt,
                    owner: user.displayName,
                    userAvatar: user.photoURL,
                    id: commentId,
                    postId: postId,
                    subCategoryId: subcategoryid,
                    categoryId: categoryid,
                    content: commentContent,
                    likes: [],
                    dislikes: [],
                    uid: user.uid,
                    isFirstComment: true,
                }
            }
        } }; 

        const curDocumentsPosts = curDocument.subCategories[subcategoryid].posts;
        curDocument.subCategories[subcategoryid].posts = {...curDocumentsPosts, ...newPost};

        await updateDocument(categoryid, curDocument);

        history.push(`/posts/${categoryid}/${subcategoryid}`);
    }

    useEffect(() => {

        const getCategory = async () => {
            const curCategory = await getDocument(categoryid)

            const currentSubCat = curCategory.subCategories[subcategoryid];

            setCategoryName(currentSubCat.category);
            setSubCategoryName(currentSubCat.subCategoryName);
        }

        getCategory();
    }, [getDocument, categoryid, subcategoryid])

    return (
      <>
        <Path categoryName={categoryName} subCategoryName={subCategoryName} catId={categoryid} subCatId={subcategoryid}></Path>
        <form className="login-form create-post" onSubmit={handleSubmit}>
          <span className="form-header-title">New post</span>
          <label>
            <div className="label-form-wrapper">
              <span>Post title: </span>
            </div>
            <div className="input-form-wrapper">
              <input
                type="text"
                onChange={(e) => setPostTitle(e.currentTarget.value)}
                required
                value={postTile}
              />
            </div>
          </label>
          <label>
            <div className="label-form-wrapper">
              <span>Post content: </span>
            </div>
            <div className="input-comment-body">
              <textarea
                cols="70"
                rows="10"
                onChange={(e) => setCommentContent(e.currentTarget.value)}
                required
                value={commentContent}
              ></textarea>
            </div>
          </label>
          {!response.isPending && <button>Create</button>}
          {response.isPending && <button disabled className="btn-loading">Loading...</button>}
        </form>
      </>
    );
}
