import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Address {
  line1?: string;
  line2?: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  address?: Address;
  gender: string;
  dob: string;
}

const MyProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
        if (userId) {
          const response = await axios.get<UserData>(`http://localhost:5000/api/users/profile/${userId}`);
          console.log("Response data:", response.data);
          setUserData(response.data);
        } else {
          console.error("No userId found in local storage");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (field: keyof UserData, value: string) => {
    if (userData) {
      setUserData({ ...userData, [field]: value });
    }
  };

  const handleAddressChange = (line: keyof Address, value: string) => {
    if (userData && userData.address) {
      setUserData({
        ...userData,
        address: { ...userData.address, [line]: value },
      });
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      <img className="w-36 rounded" src={userData.image || 'default_image_path'} alt={userData.name || "User Profile"} />
      {isEdit ? (
        <input
          className='bg-gray-50 text-3xl font-medium max-w-60 mt-4'
          type='text'
          value={userData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
      ) : (
        <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      )}
      <hr className="bg-zinc-400 h-[1px] border-none" />
      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{userData.email}</p>
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className='bg-gray-100 max-w-52'
              type='text'
              value={userData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          ) : (
            <p>{userData.phone}</p>
          )}
          <p className="font-medium">Address:</p>
          {isEdit ? (
            <p>
              <input
                className="bg-gray-50"
                onChange={(e) => handleAddressChange('line1', e.target.value)}
                value={userData.address?.line1 || ''}
              /><br />
              <input
                className="bg-gray-50"
                onChange={(e) => handleAddressChange('line2', e.target.value)}
                value={userData.address?.line2 || ''}
              />
            </p>
          ) : (
            <p className="text-gray-500">
              {userData.address?.line1}<br />{userData.address?.line2}
            </p>
          )}
        </div>
      </div>
      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-100"
              onChange={(e) => handleInputChange('gender', e.target.value)}
              value={userData.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">{userData.gender}</p>
          )}
          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              className="max-w-2 bg-gray-100"
              type="date"
              onChange={(e) => handleInputChange('dob', e.target.value)}
              value={userData.dob}
            />
          ) : (
            <p className="text-gray-400">{userData.dob}</p>
          )}
        </div>
      </div>
      <div className="mt-10">
        {isEdit ? (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            onClick={() => setIsEdit(false)}
          >
            Save Info
          </button>
        ) : (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
