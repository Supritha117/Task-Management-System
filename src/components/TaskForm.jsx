import React, { useState } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Button } from '@progress/kendo-react-buttons';
import { Card, CardBody, CardHeader, CardTitle } from '@progress/kendo-react-layout';

// Helper to parse and format date as DD/MM/YYYY
function parseDateToDDMMYYYY(dateStr) {
  if (!dateStr) return new Date();
  const dateObj = new Date(dateStr);
  // If invalid date, fallback to today
  if (isNaN(dateObj)) return new Date();
  // Format as DD/MM/YYYY
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  // Return as Date object for DatePicker
  return new Date(`${year}-${month}-${day}`);
}

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [title, setTitle] = useState(task?.title || '');
  const [date, setDate] = useState(
    task ? parseDateToDDMMYYYY(task.date) : new Date()
  );
  const [hoursWorked, setHoursWorked] = useState(task?.hoursWorked || 1);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ title, date, hoursWorked });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999 // Increased z-index
      }}
      onClick={onCancel}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 600,
          margin: '0 auto',
          boxShadow: '0 8px 32px rgba(33, 150, 243, 0.16)',
          borderRadius: '20px',
          padding: '32px',
          background: '#fff',
        }}
        onClick={e => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Title</label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                style={{ borderRadius: 8, fontSize: '1rem', padding: '8px' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Date</label>
              <DatePicker
                value={date}
                onChange={e => setDate(e.value)}
                required
                format="MM/dd/yyyy"
                style={{ borderRadius: 8, fontSize: '1rem', padding: '8px', width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Hours Worked</label>
              <Input
                type="number"
                min={1}
                value={hoursWorked}
                onChange={e => setHoursWorked(Number(e.target.value))}
                required
                style={{ borderRadius: 8, fontSize: '1rem', padding: '8px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <Button
                type="submit"
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
                  width: '50%',
                }}
                themeColor="primary"
              >
                Save
              </Button>
              <Button
                onClick={onCancel}
                style={{
                  background: '#f5f5f5',
                  color: '#333',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '10px 0',
                  border: 'none',
                  width: '50%',
                }}
                themeColor="light"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
        {/* Responsive styles */}
        <style>
          {`
            @media (max-width: 600px) {
              .k-card {
                padding: 10px !important;
                border-radius: 12px !important;
                width: 100vw !important;
                max-width: 100vw !important;
              }
              form {
                gap: 10px !important;
              }
              label {
                font-size: 1rem !important;
              }
              .k-input, .k-datepicker {
                font-size: 0.95rem !important;
              }
            }
            /* Ensure Kendo popup appears above modal */
            .k-animation-container {
              z-index: 10000 !important;
            }
          `}
        </style>
      </Card>
    </div>
  );
}
