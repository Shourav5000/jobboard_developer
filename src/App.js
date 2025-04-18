import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import Confetti from "react-confetti";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion";
import { FaLaptopCode, FaTrash, FaUserPlus } from "react-icons/fa";

function App() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [page, setPage] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [profile, setProfile] = useState({ name: "", email: "", role: "" });
  const jobsPerPage = 4;

  useEffect(() => {
    axios.get("/api/jobs").then((res) => {
      setJobs(res.data);
    });
  }, []);

  const addJob = () => {
    if (!title || !company) return;
    axios.post("/api/jobs", { title, company }).then((res) => {
      setJobs([...jobs, res.data]);
      setTitle("");
      setCompany("");
    });
  };

  const deleteJob = (id) => {
    axios.delete(`/api/jobs/${id}`).then(() => {
      setJobs(jobs.filter((job) => job.id !== id));
      toast.info("🗑️ Job removed");
    });
  };

  const apply = (jobTitle, company) => {
    setShowConfetti(true);
    toast.success(`🎉 You applied for ${jobTitle} at ${company}!`);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleProfileCreate = () => {
    if (!profile.name || !profile.email || !profile.role) {
      toast.error("Please fill out all profile fields");
      return;
    }
    toast.success(`👤 Profile Created: ${profile.name}`);
    setProfile({ name: "", email: "", role: "" });
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(filterTitle.toLowerCase()) &&
      job.company.toLowerCase().includes(filterCompany.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * jobsPerPage,
    page * jobsPerPage
  );

  return (
    <motion.div
      className="dice-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {showConfetti && <Confetti />}
      <ToastContainer />

      <motion.h1
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          fontSize: "32px",
          color: "#00f2fe",
          marginBottom: "30px"
        }}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <FaLaptopCode size={32} />
        Developer Job Board
      </motion.h1>

      {/* 🔹 Updated Dark Create Profile Section */}
      <div className="profile-section">
        <h3><FaUserPlus /> Create Profile</h3>
        <input
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Full Name"
        />
        <input
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          placeholder="Email"
        />
        <input
          value={profile.role}
          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
          placeholder="Your Role"
        />
        <button onClick={handleProfileCreate}>Create Profile</button>
      </div>

      {/* Post Job Form */}
      <motion.div className="dice-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <motion.input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job Title" whileFocus={{ scale: 1.02 }} />
        <motion.input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" whileFocus={{ scale: 1.02 }} />
        <motion.button className="dice-post-btn" onClick={addJob} whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
          Post Job
        </motion.button>
      </motion.div>

      {/* Filter */}
      <motion.div className="dice-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <motion.input value={filterTitle} onChange={(e) => { setFilterTitle(e.target.value); setPage(1); }} placeholder="Filter by title" whileFocus={{ scale: 1.02 }} />
        <motion.input value={filterCompany} onChange={(e) => { setFilterCompany(e.target.value); setPage(1); }} placeholder="Filter by company" whileFocus={{ scale: 1.02 }} />
      </motion.div>

      {/* Job List */}
      <ul className="dice-job-list">
        {paginatedJobs.map((job, index) => (
          <motion.li
            key={job.id}
            className="dice-job-item"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 12px #00f2fe" }}
          >
            <div className="dice-job-info" onClick={() => setSelectedJob(job)} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/ /g, "")}.com`}
                  alt="logo"
                  className="company-logo"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <strong>{job.title}</strong>
              </div>
              <span>at</span>
              <em>{job.company}</em>
              <div className="dice-tags">
                <span className="tag">Full-time</span>
                <span className="tag tag-grey">Remote</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <motion.button className="dice-apply-btn" onClick={() => apply(job.title, job.company)} whileHover={{ scale: 1.1 }}>
                Apply Now
              </motion.button>
              <button onClick={() => deleteJob(job.id)} className="remove-btn">
                <FaTrash /> Remove
              </button>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div className="pagination" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </motion.div>
      )}

      {/* Job Modal */}
      {selectedJob && (
        <div className="job-modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="job-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedJob.title}</h2>
            <p><strong>Company:</strong> {selectedJob.company}</p>
            <p><strong>Type:</strong> Full-time</p>
            <p><strong>Location:</strong> Remote</p>
            <p><strong>Description:</strong> This is a sample job description for {selectedJob.title}. Add more details as needed.</p>
            <button onClick={() => apply(selectedJob.title, selectedJob.company)}>Apply Now</button>
            <button className="modal-close" onClick={() => setSelectedJob(null)}>Close</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default App;
