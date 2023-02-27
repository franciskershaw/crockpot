import React from 'react';
import Header from '../../layout/header/Header';
import Icon from '../../components/icons/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <>
      <Header title="Admin Section">
        <Icon classes={'mr-3'} type={'no-hover'}>
          <FontAwesomeIcon icon={faPlus} />
        </Icon>
      </Header>
			<section className='text-center'>
				<h2 className='m-3'>Add links:</h2>
				<ul>
					<li className='mb-3'>
						<Link className='btn' to={'/addrecipe'}>Add new recipe</Link>
					</li>
					<li>
						<Link className='btn' to={'/additem'}>Add new item</Link>
					</li>
				</ul>
			</section>
    </>
  );
};

export default AdminPage;
