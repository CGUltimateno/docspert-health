import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE = 'http://localhost:8000/api'

function App() {
    const [patients, setPatients] = useState([])
    const [consultations, setConsultations] = useState([])
    const [activeTab, setActiveTab] = useState('patients')

    const [patientForm, setPatientForm] = useState({ full_name: '', date_of_birth: '', email: '' })
    const [consultationForm, setConsultationForm] = useState({ patient: '', symptoms: '', diagnosis: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchPatients()
        fetchConsultations()
    }, [])

    const fetchPatients = async () => {
        try {
            const res = await axios.get(`${API_BASE}/patients/`)
            setPatients(res.data.results || res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchConsultations = async () => {
        try {
            const res = await axios.get(`${API_BASE}/consultations/`)
            setConsultations(res.data.results || res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handlePatientSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await axios.post(`${API_BASE}/patients/`, patientForm)
            setPatientForm({ full_name: '', date_of_birth: '', email: '' })
            fetchPatients()
        } catch (err) {
            setError("Error creating patient")
        } finally {
            setLoading(false)
        }
    }

    const handleConsultationSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await axios.post(`${API_BASE}/consultations/`, consultationForm)
            setConsultationForm({ patient: '', symptoms: '', diagnosis: '' })
            fetchConsultations()
        } catch (err) {
            setError("Error creating consultation")
        } finally {
            setLoading(false)
        }
    }

    const generateAISummary = async (id) => {
        setLoading(true)
        try {
            await axios.post(`${API_BASE}/consultations/${id}/generate-summary/`)
            fetchConsultations()
        } catch (err) {
            alert("Error generating summary")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container py-5">
            <header className="mb-5 text-center">
                <h1 className="display-4 fw-bold">Docspert Health</h1>
                <p className="text-secondary">Consultation Management System</p>
            </header>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
            )}

            <ul className="nav nav-pills mb-4 justify-content-center">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'patients' ? 'active' : ''}`}
                        onClick={() => setActiveTab('patients')}
                    >
                        Patients
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'consultations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('consultations')}
                    >
                        Consultations
                    </button>
                </li>
            </ul>

            {activeTab === 'patients' && (
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-header"><h5 className="mb-0">Add New Patient</h5></div>
                            <div className="card-body">
                                <form onSubmit={handlePatientSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text" className="form-control" required
                                            value={patientForm.full_name}
                                            onChange={(e) => setPatientForm({ ...patientForm, full_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Date of Birth</label>
                                        <input
                                            type="date" className="form-control" required
                                            value={patientForm.date_of_birth}
                                            onChange={(e) => setPatientForm({ ...patientForm, date_of_birth: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email" className="form-control" required
                                            value={patientForm.email}
                                            onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {loading ? 'Processing...' : 'Register Patient'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header"><h5 className="mb-0">Patient List</h5></div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>DOB</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {patients.map(p => (
                                                <tr key={p.id}>
                                                    <td>{p.id}</td>
                                                    <td>{p.full_name}</td>
                                                    <td>{p.email}</td>
                                                    <td>{p.date_of_birth}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'consultations' && (
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-header"><h5 className="mb-0">New Consultation</h5></div>
                            <div className="card-body">
                                <form onSubmit={handleConsultationSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Patient</label>
                                        <select
                                            className="form-select" required
                                            value={consultationForm.patient}
                                            onChange={(e) => setConsultationForm({ ...consultationForm, patient: e.target.value })}
                                        >
                                            <option value="">Select Patient</option>
                                            {patients.map(p => (
                                                <option key={p.id} value={p.id}>{p.full_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Symptoms</label>
                                        <textarea
                                            className="form-control" rows="3" required
                                            value={consultationForm.symptoms}
                                            onChange={(e) => setConsultationForm({ ...consultationForm, symptoms: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Diagnosis</label>
                                        <textarea
                                            className="form-control" rows="2"
                                            value={consultationForm.diagnosis}
                                            onChange={(e) => setConsultationForm({ ...consultationForm, diagnosis: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {loading ? 'Creating...' : 'Book Consultation'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header"><h5 className="mb-0">Recent Consultations</h5></div>
                            <div className="card-body">
                                {consultations.map(c => (
                                    <div key={c.id} className="card bg-dark border-secondary mb-3">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <h6 className="card-title text-primary mb-0">{c.patient_name}</h6>
                                                    <small className="text-secondary">{new Date(c.created_at).toLocaleString()}</small>
                                                </div>
                                                {!c.ai_summary && (
                                                    <button
                                                        className="btn btn-sm btn-outline-info"
                                                        onClick={() => generateAISummary(c.id)}
                                                        disabled={loading}
                                                    >
                                                        Generate AI Summary
                                                    </button>
                                                )}
                                            </div>
                                            <p className="card-text mb-1"><small className="text-muted">Symptoms:</small> {c.symptoms}</p>
                                            {c.diagnosis && <p className="card-text mb-1"><small className="text-muted">Diagnosis:</small> {c.diagnosis}</p>}
                                            {c.ai_summary && (
                                                <div className="mt-3 p-2 bg-black bg-opacity-25 rounded border-start border-info border-4">
                                                    <span className="badge badge-summary mb-2">AI Summary</span>
                                                    <p className="small mb-0">{c.ai_summary}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
