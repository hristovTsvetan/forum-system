import "./Modal.css";

import Delete from "./Delete";
import CategoryEdit from "./CategoryEdit";
import SubcategoryEdit from "./SubcategoryEdit";
import { useModal } from "../../hooks/useModal";
import CategoryCreate from "./CategoryCreate";
import SubcategoryCreate from "./SubcategoryCreate";
import PostEdit from "./PostEdit";


export default function Modal() {
  const {
    deleteCategory,
    deleteSubcategory,
    deletePost,
    editCategory,
    editSubcategory,
    editPost,
    createSubcategory,
    createCategory,
  } = useModal();


    return (
      <div className="modal-wrapper">
        <div className="modal-content">
          {deleteCategory && <Delete />}
          {deleteSubcategory && <Delete />}
          {deletePost && <Delete />}
          {editCategory && <CategoryEdit />}
          {editSubcategory && <SubcategoryEdit />}
          {editPost && <PostEdit />}
          {createCategory && <CategoryCreate />}
          {createSubcategory && <SubcategoryCreate />}
        </div>
      </div>
    );
}