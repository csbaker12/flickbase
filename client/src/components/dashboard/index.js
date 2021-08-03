import React from 'react';
import AdminLayout from '../../hoc/adminLayout';

const Dashboard = () => {
  return (
    <AdminLayout section='Dashboard'>
      <h3>Welcome to your dashboard</h3>
      <h5>
        Here we will display updates, missed notificatoins, and upcoming events
      </h5>
    </AdminLayout>
  );
};

export default Dashboard;
