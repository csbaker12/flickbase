import React, { useState, useEffect, useReducer } from 'react';
import AdminLayout from '../../../hoc/adminLayout';
import Loader from '../../../utils/loader';

import {
  Modal,
  Button,
  ButtonToolbar,
  ButtonGroup,
  InputGroup,
  FormControl,
  // Pagination,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import {
  getPaginateArticles,
  changeStatusArticle,
  removeArticle,
} from '../../../store/actions/article_actions';
import PaginationComponent from './paginate';
// import { propTypes } from 'react-bootstrap/esm/Image';

const Articles = (props) => {
  const articles = useSelector((state) => state.articles);
  const dispatch = useDispatch();
  const [removeAlert, setRemoveAlert] = useState(false);
  const notifications = useSelector((state) => state.notifications);
  const [toRemove, setToRemove] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchValues, setSearchValues] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState,
    }),
    { value: '', memory: '' }
  );
  let limit = 5;
  let arts = articles.adminArticles;
  useEffect(() => {
    dispatch(getPaginateArticles());
  }, [dispatch]);

  const goToPrevPage = (page) => {
    dispatch(getPaginateArticles(page, limit, searchValues.memory));
  };

  const goToNextPage = (page) => {
    dispatch(getPaginateArticles(page, limit, searchValues.memory));
  };

  const triggerSearch = (e) => {
    e.preventDefault();
    if (searchValues.value !== '') {
      setSearchValues({ memory: searchValues.value });
    }
  };

  const handleStatusChange = (status, _id) => {
    let newstatus = status === 'draft' ? 'public' : 'draft';
    dispatch(changeStatusArticle(newstatus, _id));
  };

  const editArtsAction = (id) => {
    props.history.push(`/dashboard/articles/edit/${id}`);
  };

  const handleDelete = () => {
    dispatch(removeArticle(toRemove));
  };

  const handleClose = () => setRemoveAlert(false);
  const handleShow = (id = null) => {
    setToRemove(id);
    setRemoveAlert(true);
  };

  const resetSearch = () => {
    setSearchValues({ memory: '', value: '' });
    dispatch(getPaginateArticles());
  };

  useEffect(() => {
    handleClose();
    if (notifications && notifications.removeArticle) {
      dispatch(getPaginateArticles(arts.page, limit, searchValues.memory));
    }
  }, [notifications, arts, dispatch, limit, searchValues.memory]);

  useEffect(() => {
    setLoading(true);
    dispatch(getPaginateArticles(1, limit, searchValues.memory));
  }, [dispatch, searchValues.memory, limit]);

  useEffect(() => {
    setLoading(false);
  }, [articles]);

  return (
    <AdminLayout section='Articles'>
      <div className='articles_table'>
        <ButtonToolbar className='mb-3'>
          <ButtonGroup className='mr-2'>
            <LinkContainer to='/dashboard/articles/add'>
              <Button variant='secondary'>Add article</Button>
            </LinkContainer>
          </ButtonGroup>
          <form onSubmit={triggerSearch}>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id='btnGroupAddon2'>@</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type='text'
                placeholder='Example'
                onChange={(e) => setSearchValues({ value: e.target.value })}
                value={searchValues.value}
              />
            </InputGroup>
          </form>
        </ButtonToolbar>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div>
              {searchValues.memory !== '' ? (
                <p>
                  Your search for <b>'{searchValues.memory}'</b> had{' '}
                  {articles.adminArticles.totalDocs} results
                  <span
                    className='ml-1'
                    style={{ color: 'blue', cursor: 'pointer' }}
                    onClick={() => resetSearch()}>
                    Reset Search
                  </span>
                </p>
              ) : null}
            </div>
            <PaginationComponent
              arts={arts}
              prev={(page) => goToPrevPage(page)}
              next={(page) => goToNextPage(page)}
              handleStatusChange={(status, id) =>
                handleStatusChange(status, id)
              }
              editArtsAction={(id) => editArtsAction(id)}
              handleShow={(id) => handleShow(id)}
            />
          </>
        )}

        <Modal show={removeAlert} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>There is no going back</Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Oops, close this
            </Button>
            <Button variant='danger' onClick={() => handleDelete()}>
              Send it
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Articles;
