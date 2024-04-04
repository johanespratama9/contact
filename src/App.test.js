import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom'
import axios from 'axios';
import App from './App';


jest.mock('axios');

describe('App', () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 'b3abd640-c92b-11e8-b02f-cbfa15db428b',
            firstName: 'Luke',
            lastName: 'Skywalker',
            age: 20,
            photo: 'https://picsum.photos/200/300/?blur=2'
          }
        ]
      }
    });
  });

  test('renders loading message initially', async () => {
    const { getByText } = render(<App />);
    expect(getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  });

  test('renders contact details modal when View button is clicked', async () => {
    const { getByText, getByAltText } = render(<App />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    
    fireEvent.click(getByText('View'));
    
    await waitFor(() => {
      expect(getByText('Contact Detail')).toBeInTheDocument();
      expect(getByText('ID:')).toBeInTheDocument();
      expect(getByText('First Name:')).toBeInTheDocument();
      expect(getByText('Last Name:')).toBeInTheDocument();
      expect(getByText('Age:')).toBeInTheDocument();
      expect(getByText('Photo:')).toBeInTheDocument();
      expect(getByAltText('Photo')).toBeInTheDocument();
    });
  });

  test('closes contact details modal when close button is clicked', async () => {
    const { getByText, queryByText, findByText } = render(<App />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    
    fireEvent.click(getByText('View'));
    
    await findByText('Contact Detail');
    
    fireEvent.click(getByText('×'));
    
    expect(queryByText('Contact Detail')).not.toBeInTheDocument();
  });

  test('fetches contact details when View button is clicked', async () => {
    const { getByText } = render(<App />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    
    fireEvent.click(getByText('View'));
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://contact.herokuapp.com/contact/b3abd640-c92b-11e8-b02f-cbfa15db428b');
    });
  });
});
