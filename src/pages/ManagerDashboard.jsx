import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Card, CardBody, CardHeader, CardTitle } from '@progress/kendo-react-layout';
import { filterBy } from '@progress/kendo-data-query';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Badge } from '@progress/kendo-react-indicators';

const statusOptions = ['Pending', 'Approved', 'Rejected'];
const options = statusOptions.length ? ['--Select--', ...statusOptions] : [];

export default function ManagerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // default to 'Pending'
  const [filter, setFilter] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const { data } = await axiosClient.get('/task/all');
    // setTasks(data);
    setTasks(data.map(task => {
      if (!task.date) return { ...task, date: null };

      const d = new Date(task.date);
      d.setHours(0, 0, 0, 0); // Remove time for date-only comparison
      return { ...task, date: d };
    }));
  }

  async function approveRejectTask(id, status) {
    await axiosClient.put(`/Task/status?id=${id}`, { status });
    loadTasks();
  }

  async function handleApproveReject(status) {
    if (selectedTask) {
      await approveRejectTask(selectedTask.id, status);
      setShowDialog(false);
      setSelectedTask(null);
      setActionMessage(`Task ${status === 'Approved' ? 'approved' : 'rejected'} successfully.`);
      setTimeout(() => setActionMessage(''), 2000);
    }
  }

  function getStatusColor(status) {
    if (status === 'Approved') return 'success';
    if (status === 'Rejected') return 'error';
    return 'warning';
  }

  // Helper to format date as D/M/YYYY
  function formatDateDMY(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  const filteredTasks = filter
    ? filterBy(tasks, filter)
    : tasks;
  // Apply search and status filter after grid filter
  const displayedTasks = filteredTasks
    .filter(t => !searchEmployee || (t.userName || '').toLowerCase().includes(searchEmployee.toLowerCase()))
    .filter(t => !filterStatus || t.status === filterStatus);

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
            width: '100vw',
            maxWidth: '100vw',
            padding: 0,
            height: 'calc(100vh - 60px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Card
            style={{
              width: '100vw',
              height: '100%',
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
              <CardTitle>All Tasks</CardTitle>
            </CardHeader>
            <CardBody>
              <div style={{ marginBottom: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Input
                  placeholder="Search employee"
                  value={searchEmployee}
                  onChange={e => setSearchEmployee(e.target.value)}
                />
                <DropDownList
                  data={options}
                  value={filterStatus || '--Select--'}
                  onChange={e => setFilterStatus(e.target.value === '--Select--' ? '' : e.target.value)}
                  style={{ width: 150 }}
                  itemRender={(li, itemProps) => {
                    if (itemProps.dataItem === '--Select--') {
                      return (
                        <li {...itemProps} disabled style={{ color: '#aaa' }}>
                          {itemProps.dataItem}
                        </li>
                      );
                    }
                    return li;
                  }}
                />
                <Button themeColor="success" onClick={() => {
                  loadTasks();
                  setFilterStatus('');
                }}>Refresh</Button>
              </div>
              <Grid
                style={{ maxHeight: 400, marginTop: 10, background: '#fff', borderRadius: '8px', boxShadow: '0 1px 4px rgba(33,150,243,0.08)' }}
                data={displayedTasks}
                pageable
                sortable
                filterable
                filter={filter}
                onFilterChange={e => setFilter(e.filter)}
                onRowClick={e => {
                  setSelectedTask(e.dataItem);
                  setShowDialog(true);
                }}
              >
                <Column field="userName" title="Employee" />
                <Column field="title" title="Title" />
                <Column
                  field="date"
                  title="Date"
                  filter="date"
                  format="{0:MM/dd/yyyy}"
                />
                <Column field="hoursWorked" title="Hours Worked" />
                <Column field="status" title="Status" />
              </Grid>
              {actionMessage && (
                <div style={{
                  margin: '10px 0',
                  padding: '10px 16px',
                  background: '#e3fcec',
                  color: '#256029',
                  borderRadius: 8,
                  fontWeight: 500,
                  boxShadow: '0 1px 4px rgba(33,150,243,0.08)'
                }}>
                  {actionMessage}
                </div>
              )}
              {showDialog && selectedTask && (
                <Dialog
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>Update Task Status</span>
                    </div>
                  }
                  onClose={() => {
                    setShowDialog(false);
                    setSelectedTask(null);
                  }}
                >
                  <div style={{ padding: '10px 0', minWidth: 260 }}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Employee:</strong> <span style={{ color: '#1976d2' }}>{selectedTask.userName}</span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Title:</strong> <span>{selectedTask.title}</span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Date:</strong> <span>{formatDateDMY(selectedTask.date)}</span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Hours Worked:</strong> <span>{selectedTask.hoursWorked}</span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Status:</strong> <span color={getStatusColor(selectedTask.status)}>{selectedTask.status}</span>
                      
                    </div>
                  </div>
                  <DialogActionsBar>
                    <Button
                      themeColor="success"
                      onClick={() => handleApproveReject('Approved')}
                      disabled={selectedTask.status === 'Approved'}
                      style={{ marginRight: 8 }}
                    >
                      Approve
                    </Button>
                    <Button
                      themeColor="error"
                      onClick={() => handleApproveReject('Rejected')}
                      disabled={selectedTask.status === 'Rejected'}
                    >
                      Reject
                    </Button>
                  </DialogActionsBar>
                </Dialog>
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
