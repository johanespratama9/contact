import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import axios from 'axios';

function ContactDetail({ contactId }) {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axios.get(`https://contact.herokuapp.com/contact/${contactId}`);
        setContact(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contact:', error);
        setLoading(false);
      }
    };

    fetchContact();
  }, [contactId]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Contact Detail</h2>
          <table className="table">
            <tbody>
              <tr>
                <td>ID:</td>
                <td>{contact.id}</td>
              </tr>
              <tr>
                <td>First Name:</td>
                <td>{contact.firstName}</td>
              </tr>
              <tr>
                <td>Last Name:</td>
                <td>{contact.lastName}</td>
              </tr>
              <tr>
                <td>Age:</td>
                <td>{contact.age}</td>
              </tr>
              <tr>
                <td>Photo:</td>
                <td>
                  <img
                    src={contact.photo}
                    alt="Photo"
                    style={{ maxWidth: '100px', maxHeight: '100px' }} 
                    className="img-fluid"
                  /> 
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function App() {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    photo: ''
  });
  const [editingContact, setEditingContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedContactId, setSelectedContactId] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const cachedData = localStorage.getItem('contacts');
        if (cachedData) {
          setContacts(JSON.parse(cachedData));
          setLoading(false);
        } else {
          const response = await axios.get('https://contact.herokuapp.com/contact');
          setContacts(response.data.data);
          localStorage.setItem('contacts', JSON.stringify(response.data.data));
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      age: contact.age,
      photo: contact.photo
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://contact.herokuapp.com/contact/${id}`);
      setContacts(contacts.filter(contact => contact.id !== id));
      localStorage.setItem('contacts', JSON.stringify(contacts.filter(contact => contact.id !== id)));
      alert('Contact has been deleted successfully!');
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContact) {
        await axios.put(`https://contact.herokuapp.com/contact/${editingContact.id}`, formData);
        alert('Contact has been updated successfully!');
      } else {
        await axios.post('https://contact.herokuapp.com/contact', formData);
        alert('Contact has been created successfully!');
      }
      setShowModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        photo: ''
      });
      const response = await axios.get('https://contact.herokuapp.com/contact');
      setContacts(response.data.data);
      localStorage.setItem('contacts', JSON.stringify(response.data.data));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleViewDetail = (id) => {
    setSelectedContactId(id);
  };

  return (
    <div className="App">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="App-content mx-auto" style={{ maxWidth: '1000px' }}>
          <h2>Contact</h2>
          <button className="btn btn-primary mb-3" onClick={() => { setEditingContact(null); setShowModal(true); }}>Create</button>
          {selectedContactId && <ContactDetail contactId={selectedContactId} />} 
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Age</th>
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(contacts) && contacts.map(contact => (
                <tr key={contact.id}>
                  <td>{contact.id}</td>
                  <td>{contact.firstName}</td>
                  <td>{contact.lastName}</td>
                  <td>{contact.age}</td>
                  <td>
                    <img
                      src={contact.photo}
                      alt="Photo"
                      style={{ maxWidth: '100px', maxHeight: '100px' }} 
                      className="img-fluid"
                    />
                  </td>
                  <td>
                    <div className="button-container">
                      <button className="btn btn-primary btn-sm mr-2" onClick={() => handleEdit(contact)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                          <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(contact.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                      </button>
                      <button className="btn btn-info btn-sm" onClick={() => handleViewDetail(contact.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingContact ? 'Edit Contact' : 'Create Contact'}</h5>
              <button type="button" className="close" onClick={() => setShowModal(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" className="form-control" name="age" value={formData.age} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Photo URL</label>
                  <input type="text" className="form-control" name="photo" value={formData.photo} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">{editingContact ? 'Update' : 'Create'}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default App;
