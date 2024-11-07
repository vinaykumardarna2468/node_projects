// src/MobileManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import './MobileManagement.css';

const apiBaseUrl = "http://localhost:5000"; // Your backend URL

const MobileManagement = () => {
    const [mobiles, setMobiles] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [storage, setStorage] = useState('');
    const [showMobiles,setShowMobiles] = useState(false)

    useEffect(() => {
        getAllMobiles();
    }, [])

    const getAllMobiles = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/mobiles`);
            setMobiles(response.data);
        } catch (error) {
            alert("Failed to retrieve mobiles");
        }
    };

    const addMobile = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiBaseUrl}/mobiles`, { name, price, storage });
            alert("Mobile added successfully!");
            setName('');
            setPrice('');
            setStorage('');
            getAllMobiles(); // Refresh mobile list
        } catch (error) {
            alert("Failed to add mobile");
        }
    };

    const deleteMobile = async (id) => {
        try {
            await axios.delete(`${apiBaseUrl}/mobiles`, { data: { id } });
            alert("Mobile deleted successfully!");
            getAllMobiles(); // Refresh mobile list
        } catch (error) {
            alert("Failed to delete mobile");
        }
    };

    const editMobile = async (id) => {
        const updatedName = prompt("Enter new name:");
        const updatedPrice = prompt("Enter new price:");
        const updatedStorage = prompt("Enter new storage:");

        if (updatedName && updatedPrice && updatedStorage) {
            try {
                await axios.put(`${apiBaseUrl}/mobiles`, {
                    id,
                    name: updatedName,
                    price: updatedPrice,
                    storage: updatedStorage
                });
                alert("Mobile updated successfully!");
                getAllMobiles(); // Refresh mobile list
            } catch (error) {
                alert("Failed to update mobile");
            }
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        console.log(event.target.value)
        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                try {
                    const mobilesData = results.data.map((row) => ({
                        name: row.name,
                        price: row.price,
                        storage: row.storage,
                    }));

                    await axios.post(`${apiBaseUrl}/mobiles/bulk`, mobilesData);
                    alert("Mobiles uploaded successfully!");
                    getAllMobiles();
                } catch (error) {
                    alert("Failed to upload mobiles");
                }
            },
            error: (error) => {
                console.error("Error details123:", error);
                alert("Failed to parse file");
            }
        });
    };

    return(

        <div>
            <h1>Mobile Management</h1>
             {/* Upload CSV */}
             <h2>Upload</h2>
            <input type="file" accept=".csv" onChange={handleFileUpload} />


            <h2>Add Mobile</h2>
            <form onSubmit={addMobile}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Storage"
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    required
                />
                <button type="submit">Add Mobile</button>
            </form>

            <button onClick={() => setShowMobiles(!showMobiles)}>
                {showMobiles ? 'Hide Mobiles' : 'Show Mobiles'}
            </button>

            {showMobiles && 
            <><h2>Mobiles List</h2>
            <div id="mobileList" style={{ display: mobiles.length ? 'block' : 'none' }}>
                {mobiles.map((mobile) => (
                    <div key={mobile.id}>
                        <strong>ID:</strong> {mobile.id},
                        <strong>Name:</strong> {mobile.name},
                        <strong>Price:</strong> {mobile.price},
                        <strong>Storage:</strong> {mobile.storage}
                        <button onClick={() => editMobile(mobile.id)}>Edit</button>
                        <button onClick={() => deleteMobile(mobile.id)}>Delete</button>
                    </div>
                ))}
            </div></>}
        </div>)
}

export default MobileManagement;
