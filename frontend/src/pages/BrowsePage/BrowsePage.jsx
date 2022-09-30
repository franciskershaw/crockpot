import Header from '../../layout/header/Header';
import Icon from '../../components/global/icons/Icon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'


const BrowsePage = () => {
  return (
    <>
      <Header title="Browse Recipes">
        <Icon classes={"ml-2"} type={"no-hover"}>
          <FontAwesomeIcon icon={faMagnifyingGlass}/>
        </Icon>
      </Header>
      <div>Browse Page</div>
    </>
  );
};

export default BrowsePage;
