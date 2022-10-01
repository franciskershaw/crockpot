import Header from '../../layout/header/Header';
import Icon from '../../components/icons/Icon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus} from '@fortawesome/free-solid-svg-icons'

const AddRecipePage = () => {
  return (
    <>
      <Header title="Add recipe">
        <Icon classes={"ml-2"} type={"no-hover"}>
          <FontAwesomeIcon icon={faPlus}/>
        </Icon>
      </Header>
      <div>AddRecipePage</div>
    </>
  );
};

export default AddRecipePage;
