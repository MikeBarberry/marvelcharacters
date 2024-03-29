import { useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { StyledLoadingButton } from '../styles/styledComponentProvider';
import { API_URL, IMAGE_BUCKET } from '../lib/api';

const reducer = (state, action) => {
  switch (action.type) {
    case 'setCharacter': {
      return {
        ...state,
        ...action.initialVersion,
      };
    }
    case 'updateName': {
      return {
        ...state,
        name: action.name,
      };
    }
    case 'updateThumbnail': {
      return {
        ...state,
        thumbnail: action.thumbnail,
      };
    }
    case 'updateDescription': {
      return {
        ...state,
        description: action.description,
      };
    }
    case 'setIsSubmitLoading': {
      return {
        ...state,
        isSubmitLoading: action.isSubmitLoading,
      };
    }
    case 'setIsDeleteLoading': {
      return {
        ...state,
        isDeleteLoading: action.isDeleteLoading,
      };
    }
    case 'setIsSnackbarOpen': {
      return {
        ...state,
        isSnackbarOpen: action.isSnackbarOpen,
      };
    }
    case 'setSnackbarType': {
      return {
        ...state,
        snackbarType: action.snackbarType,
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
};

const initialState = {
  id: '',
  originalThumbnail: '',
  name: '',
  thumbnail: '',
  description: '',
  isSubmitLoading: false,
  isDeleteLoading: false,
  isSnackbarOpen: false,
  snackbarType: '',
};

export default function Edit() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const characterInfo = JSON.parse(localStorage.getItem('characterInfo'));
    const { _id, name, description, thumbnail } = characterInfo;
    dispatch({
      type: 'setCharacter',
      initialVersion: {
        id: _id,
        originalThumbnail: thumbnail,
        name,
        description,
        thumbnail,
      },
    });
  }, []);

  const handleSubmit = async () => {
    if (!state.name || !state.description || !state.thumbnail) {
      dispatch({ type: 'setIsSnackbarOpen', isSnackbarOpen: true });
      dispatch({ type: 'setSnackbarType', snackbarType: 'error' });
      return;
    }
    try {
      dispatch({ type: 'setIsSubmitLoading', isSubmitLoading: true });
      await fetch('/api/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: state.id,
          name: state.name,
          description: state.description,
          thumbnail: state.thumbnail,
        }),
      });
      dispatch({ type: 'setIsSubmitLoading', isSubmitLoading: false });
      dispatch({ type: 'setIsSnackbarOpen', isSnackbarOpen: true });
      dispatch({ type: 'setSnackbarType', snackbarType: 'edit' });
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      dispatch({ type: 'setIsDeleteLoading', isDeleteLoading: true });
      await fetch(`${API_URL}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ characterId: state.id }),
      });
      dispatch({ type: 'setIsDeleteLoading', isDeleteLoading: false });
      dispatch({ type: 'setIsSnackbarOpen', isSnackbarOpen: true });
      dispatch({ type: 'setSnackbarType', snackbarType: 'delete' });
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    dispatch({ type: 'setIsSnackbarOpen', isSnackbarOpen: false });
  };

  const getMessage = () => {
    switch (state.snackbarType) {
      case 'error':
        return 'Input fields must not be empty.';
      case 'edit':
        return 'Character successfully edited!';
      case 'delete':
        return 'Character successfully deleted.';
    }
  };

  return (
    <div className='Header Main-header'>
      <img
        src={`${IMAGE_BUCKET}/marvelLogo.jpeg`}
        alt='Marvel Logo'
        width={680}
        height={180}
      />
      <div
        className='edit-container'
        style={{ backgroundImage: `url(${state.originalThumbnail})` }}>
        <br />
        <label>
          Name:
          <input
            type='text'
            onChange={(e) =>
              dispatch({ type: 'updateName', name: e.target.value })
            }
            value={state.name}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <input
            type='text'
            maxLength='120'
            onChange={(e) =>
              dispatch({
                type: 'updateDescription',
                description: e.target.value,
              })
            }
            value={state.description}
            required
          />
        </label>
        <label>
          Thumbnail:
          <input
            type='text'
            placeholder='Enter URL to character image'
            onChange={(e) =>
              dispatch({ type: 'updateThumbnail', thumbnail: e.target.value })
            }
            value={state.thumbnail}
            required
          />
        </label>
        <StyledLoadingButton
          loading={state.isSubmitLoading}
          onClick={handleSubmit}>
          Submit
        </StyledLoadingButton>
        <br />
        <StyledLoadingButton
          loading={state.isDeleteLoading}
          onClick={handleDelete}>
          Delete
        </StyledLoadingButton>
        <Snackbar
          open={state.isSnackbarOpen}
          message={getMessage()}
          onClose={closeSnackbar}
          autoHideDuration={3000}>
          <Alert
            onClose={closeSnackbar}
            severity={state.snackbarType === 'error' ? 'error' : 'success'}>
            {getMessage()}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
