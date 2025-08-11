import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Card, CardBody, CardHeader, CardTitle } from '@progress/kendo-react-layout';
import { filterBy } from '@progress/kendo-data-query';

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [rowTask, setRowTask] = useState(null);
  const [showRowOptions, setShowRowOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState({ skip: 0, take: 10 }); // default page size 10

  // Get userId from login response stored in localStorage
  const userId = JSON.parse(localStorage.getItem('userId'));

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const { data } = await axiosClient.get('/task/my-tasks');
    setTasks(data.map(task => {
      if (!task.date) return { ...task, date: null };

      const d = new Date(task.date);
      d.setHours(0, 0, 0, 0); // Remove time for date-only comparison
      return { ...task, date: d };
    }));
  }

  async function handleAdd(taskData) {
    // Add userId to taskData
    await axiosClient.post('/task', { ...taskData, userId });
    setShowForm(false);
    loadTasks();
  }

  async function handleEdit(taskData) {
    // Add id and userId to taskData
    await axiosClient.put(`/task/${editTask.id}`, { ...taskData, id: editTask.id, userId });
    setEditTask(null);
    setShowForm(false);
    loadTasks();
  }

  async function deleteTask(taskId) {
    await axiosClient.delete(`/task/${taskId}`);
    loadTasks();
  }

  function onRowClick(event) {
    setRowTask(event.dataItem);
    setShowRowOptions(true);
  }

  function handleEditOption() {
    setEditTask(rowTask);
    setShowForm(true);
    setShowRowOptions(false);
  }

  function handleDeleteOption() {
    setShowDeleteConfirm(true);
    setShowRowOptions(false);
  }

  async function handleDeleteConfirmed() {
    await deleteTask(rowTask.id);
    setShowDeleteConfirm(false);
    setRowTask(null);
  }

  function handleCancelDelete() {
    setShowDeleteConfirm(false);
    setRowTask(null);
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#e3f2fd',
          width: '100vw',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            marginTop: '60px',
            width: '100vw', // changed from '100%' to '100vw'
            maxWidth: '100vw', // changed from 700 to '100vw'
            padding: 0, // removed side padding
            height: 'calc(100vh - 60px)', // fill remaining height below navbar
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Card
            style={{
              width: '100vw', // fill full width
              height: '100%', // fill full height
              padding: '20px',
              margin: 'auto',
              boxShadow: '0 4px 24px rgba(33, 150, 243, 0.08)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
            </CardHeader>
            <CardBody>
              {!showForm && (
                <Button
                  onClick={() => { setEditTask(null); setShowForm(true); }}
                  style={{
                    background: '#007bff',
                    color: '#fff',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    padding: '10px 0',
                    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.12)',
                    border: 'none',
                    transition: 'background 0.2s',
                    marginBottom: 20,
                    width: '100%',
                  }}
                  themeColor="primary"
                >
                  Add New Task
                </Button>
              )}
              {/* TaskForm Modal */}
              {showForm && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2000
                }}
                  onClick={() => setShowForm(false)}
                >
                  <div
                    style={{
                      background: '#fff',
                      padding: 24,
                      borderRadius: 16,
                      boxShadow: '0 4px 24px rgba(33,150,243,0.12)',
                      minWidth: 320,
                      maxWidth: '90vw'
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <TaskForm
                      task={editTask}
                      onSubmit={editTask ? handleEdit : handleAdd}
                      onCancel={() => setShowForm(false)}
                    />
                  </div>
                </div>
              )}
              <Grid
                style={{ maxHeight: 400, marginTop: 10, background: '#fff', borderRadius: '8px', boxShadow: '0 1px 4px rgba(33,150,243,0.08)' }}
                data={
                  filter
                    ? filterBy(tasks, filter).slice(page.skip, page.skip + page.take)
                    : tasks.slice(page.skip, page.skip + page.take)
                }
                total={filter ? filterBy(tasks, filter).length : tasks.length}
                skip={page.skip}
                onRowClick={onRowClick}
                pageable={{ buttonCount: 5, pageSizes: true, pageSize: page.take }}
                onPageChange={e => setPage({ skip: e.page.skip, take: e.page.take })}
                sortable
                filterable
                filter={filter}
                onFilterChange={e => setFilter(e.filter)}
              >
                <Column field="title" title="Title" filterable={true} />
                <Column
                  field="date"
                  title="Date"
                  filter="date"
                  format="{0:MM/dd/yyyy}"
                  filterable={true}
                />
                <Column field="hoursWorked" title="Hours Worked" filterable={true} />
                <Column field="status" title="Status" filterable={true} />
              </Grid>
              {/* Row options modal */}
              {showRowOptions && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                  background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                  <div style={{
                    background: '#fff',
                    padding: 32, // medium padding
                    borderRadius: 12,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                    minWidth: 340, // medium width
                    maxWidth: 420 // optional: restrict max width for medium size
                  }}>
                    <div style={{ marginBottom: 16, fontWeight: 600 }}>Select Action</div>
                    <Button
                      style={{ marginBottom: 12, width: '100%', background: '#007bff', color: '#fff', border: '#007bff' }}
                      themeColor="info"
                      onClick={handleEditOption}
                    >
                      Edit Task
                    </Button>
                    <Button
                      style={{ width: '100%' }}
                      themeColor="error"
                      onClick={handleDeleteOption}
                    >
                      Delete Task
                    </Button>
                    <Button
                      style={{ marginTop: 16, width: '100%' }}
                      themeColor="light"
                      onClick={() => { setShowRowOptions(false); setRowTask(null); }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              {/* Delete confirmation modal */}
              {showDeleteConfirm && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                  background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001
                }}>
                  <div style={{
                    background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.12)', minWidth: 260
                  }}>
                    <div style={{ marginBottom: 16, fontWeight: 600 }}>
                      Are you sure you want to delete this task?
                    </div>
                    <Button
                      style={{ marginBottom: 12, width: '100%' }}
                      themeColor="error"
                      onClick={handleDeleteConfirmed}
                    >
                      Yes, Delete
                    </Button>
                    <Button
                      style={{ width: '100%' }}
                      onClick={handleCancelDelete}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
        {/* Responsive styles */}
        <style>
          {`
            @media (max-width: 600px) {
              div[style*="marginTop"] {
                margin-top: 20px !important;
                max-width: 100vw !important;
                padding: 0 !important;
                height: calc(100vh - 20px) !important;
              }
              .k-card {
                padding: 10px !important;
                border-radius: 8px !important;
                width: 100vw !important;
                height: 100% !important;
              }
              form {
                gap: 10px !important;
              }
              .k-grid {
                font-size: 0.95rem !important;
              }
            }
            @media (min-width: 601px) and (max-width: 900px) {
              div[style*="marginTop"] {
                margin-top: 40px !important;
                max-width: 100vw !important;
                padding: 0 !important;
                height: calc(100vh - 40px) !important;
              }
              .k-card {
                padding: 16px !important;
                border-radius: 12px !important;
                width: 100vw !important;
                height: 100% !important;
              }
            }
          `}
        </style>
      </div>
    </>
  );
}
