import React, { useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    resume: ''
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile submitted!\n\n' + JSON.stringify(profile, null, 2));
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-xl space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Resume Link / Description</label>
          <textarea
            name="resume"
            value={profile.resume}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            rows={4}
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
