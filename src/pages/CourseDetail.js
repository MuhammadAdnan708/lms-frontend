import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService, enrollmentService, reviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [reviewStats, setReviewStats] = useState({ totalReviews: 0, averageRating: 0 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await courseService.getOne(id);
        setCourse(data);
        
        // Fetch reviews
        try {
          const { data: reviewData } = await reviewService.getCourseReviews(id);
          setReviews(reviewData.reviews || []);
          setReviewStats({
            totalReviews: reviewData.totalReviews || 0,
            averageRating: reviewData.averageRating || 0
          });
          
          // Get my review
          if (user) {
            try {
              const { data: myRev } = await reviewService.getMyReview(id);
              setMyReview(myRev.review);
            } catch (e) {}
          }
        } catch (e) {}
        
        if (user) {
          try {
            const { data: enrollments } = await enrollmentService.getMyCourses();
            const isEnrolled = enrollments.some(e => e.course?._id === id);
            setEnrolled(isEnrolled);
          } catch (e) {
            console.log('Not enrolled');
          }
        }
      } catch (err) {
        console.log('Course not found');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPayment(false);
    try {
      await enrollmentService.enroll(id);
      setEnrolled(true);
      alert('Payment successful! You are now enrolled.');
    } catch (error) {
      alert(error.response?.data?.message || 'Enrollment failed');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      if (myReview) {
        await reviewService.updateReview(myReview._id, reviewData);
        alert('Review updated!');
      } else {
        await reviewService.addReview({ courseId: id, ...reviewData });
        alert('Review submitted!');
      }
      // Refresh reviews
      const { data: reviewData2 } = await reviewService.getCourseReviews(id);
      setReviews(reviewData2.reviews || 0);
      setReviewStats({ totalReviews: reviewData2.totalReviews, averageRating: reviewData2.averageRating });
      const { data: myRev } = await reviewService.getMyReview(id);
      setMyReview(myRev.review);
      setShowReviewForm(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleDeleteReview = async () => {
    if (!myReview) return;
    if (!window.confirm('Delete your review?')) return;
    try {
      await reviewService.deleteReview(myReview._id);
      setMyReview(null);
      setShowReviewForm(false);
      const { data: reviewData } = await reviewService.getCourseReviews(id);
      setReviews(reviewData.reviews || []);
      setReviewStats({ totalReviews: reviewData.totalReviews, averageRating: reviewData.averageRating });
      alert('Review deleted!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop";

  if (loading) {
    return (
      <div style={{ paddingTop: '70px' }}>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ paddingTop: '70px' }}>
        <div className="container py-5 text-center">
          <h2>Course not found</h2>
          <Link to="/courses" className="btn btn-primary mt-3">Back to Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #162d59 0%, #1e3d6b 100%)', padding: '3rem 0' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span className="badge" style={{ background: '#ff7f40', color: 'white', marginBottom: '1rem' }}>{course.category}</span>
              <h1 style={{ color: 'white', marginBottom: '1rem', fontSize: '2.5rem' }}>{course.title}</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', marginBottom: '1rem' }}>{course.description?.substring(0, 200)}...</p>
              <div className="d-flex gap-3 align-items-center">
                <span style={{ color: 'white' }}><strong>Instructor:</strong> {course.instructor?.name}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}><strong>{course.lessons?.length || 0}</strong> lessons</span>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}><strong>{course.lessons?.reduce((acc, l) => acc + l.duration, 0) || 0}</strong> min</span>
              </div>
            </div>
            <div className="col-lg-4 mt-4 mt-lg-0">
              <img src={course.thumbnail || defaultImage} alt={course.title} style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8">
            {/* About Section */}
            <div className="mb-5">
              <h3 style={{ color: 'var(--primary-blue)', marginBottom: '1rem', borderBottom: '2px solid #ff7f40', paddingBottom: '0.5rem', display: 'inline-block' }}>About This Course</h3>
              <p style={{ lineHeight: 1.8, color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '1rem' }}>{course.description}</p>
            </div>

            {/* Course Content */}
            <div className="mb-5">
              <h3 style={{ color: 'var(--primary-blue)', marginBottom: '1rem', borderBottom: '2px solid #ff7f40', paddingBottom: '0.5rem', display: 'inline-block' }}>Course Content</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{course.lessons?.length || 0} lessons • {course.lessons?.reduce((acc, l) => acc + l.duration, 0) || 0} minutes</p>
              
              {course.lessons?.length > 0 ? (
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                  {course.lessons.map((lesson, index) => (
                    <div key={index}>
                      <div onClick={() => setExpandedLesson(expandedLesson === index ? null : index)} style={{ padding: '1rem 1.5rem', borderBottom: index < course.lessons.length - 1 ? '1px solid var(--border-color)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: index % 2 === 0 ? 'white' : 'var(--bg-light)', cursor: 'pointer' }}>
                        <div className="d-flex align-items-center">
                          <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem', fontSize: '0.875rem', fontWeight: '600' }}>{index + 1}</div>
                          <div>
                            <div style={{ fontWeight: '500', color: 'var(--primary-blue)' }}>{lesson.title}</div>
                            <small style={{ color: 'var(--text-muted)' }}>{lesson.content}</small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="badge" style={{ background: 'var(--bg-light)', color: 'var(--text-muted)' }}>{lesson.duration} min</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2" style={{ marginLeft: '10px', transform: expandedLesson === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                      </div>
                      
                      {expandedLesson === index && lesson.definition && (
                        <div style={{ padding: '1.5rem', background: '#f8f9fa', borderBottom: '1px solid var(--border-color)' }}>
                          {(enrolled || user?.role === 'admin' || user?.role === 'instructor') && lesson.videoUrl && (
                            <div style={{ marginBottom: '1.5rem' }}>
                              <h6 style={{ color: 'var(--primary-blue)', marginBottom: '0.75rem' }}><span style={{ background: '#dc3545', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', marginRight: '8px' }}>V</span>Video Lesson</h6>
                              <div style={{ marginLeft: '32px', position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '8px', overflow: 'hidden' }}>
                                <iframe
                                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                  src={lesson.videoUrl}
                                  title={lesson.title}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            </div>
                          )}
                          {!enrolled && user?.role !== 'admin' && user?.role !== 'instructor' && lesson.videoUrl && (
                            <div style={{ marginBottom: '1.5rem', marginLeft: '32px' }}>
                              <div className="alert alert-info" style={{ padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ marginBottom: '0.5rem' }}><strong>📹 Video Available</strong></p>
                                <p style={{ marginBottom: 0, fontSize: '0.9rem' }}>Enroll to watch video lessons</p>
                              </div>
                            </div>
                          )}
                          
                          <div style={{ marginBottom: '1.5rem' }}>
                            <h6 style={{ color: 'var(--primary-blue)', marginBottom: '0.75rem' }}><span style={{ background: '#ff7f40', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', marginRight: '8px' }}>D</span>Definition</h6>
                            <p style={{ color: 'var(--text-dark)', marginBottom: 0, paddingLeft: '32px', lineHeight: 1.7 }}>{lesson.definition}</p>
                          </div>
                          
                          {lesson.example && (
                            <div style={{ marginBottom: '1.5rem' }}>
                              <h6 style={{ color: 'var(--primary-blue)', marginBottom: '0.75rem' }}><span style={{ background: '#28a745', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', marginRight: '8px' }}>E</span>Example</h6>
                              <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '1rem', borderRadius: '8px', marginBottom: 0, marginLeft: '32px', overflow: 'auto', fontSize: '0.875rem' }}>{lesson.example}</pre>
                            </div>
                          )}
                          
                          {lesson.description && (
                            <div>
                              <h6 style={{ color: 'var(--primary-blue)', marginBottom: '0.75rem' }}><span style={{ background: 'var(--primary-blue)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', marginRight: '8px' }}>D</span>Description</h6>
                              <p style={{ color: 'var(--text-dark)', marginBottom: 0, paddingLeft: '32px', lineHeight: 1.7 }}>{lesson.description}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center', background: 'var(--bg-light)', borderRadius: '12px' }}>Course content coming soon</p>
              )}
            </div>

            {/* Instructor */}
            <div>
              <h3 style={{ color: 'var(--primary-blue)', marginBottom: '1rem', borderBottom: '2px solid #22d3ee', paddingBottom: '0.5rem', display: 'inline-block' }}>Your Instructor</h3>
              <div className="card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
                <div className="d-flex align-items-center">
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #22d3ee, #06b6d4)', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '600', marginRight: '1.5rem' }}>{course.instructor?.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <h5 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>{course.instructor?.name}</h5>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>Expert instructor with years of experience in teaching.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ color: '#0f172a', marginBottom: '1rem', borderBottom: '2px solid #22d3ee', paddingBottom: '0.5rem', display: 'inline-block' }}>Student Reviews</h3>
              
              <div className="card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>
                      {reviewStats.averageRating} 
                      <span style={{ color: '#fbbf24', fontSize: '1.5rem' }}> ★</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>{reviewStats.totalReviews} reviews</div>
                  </div>
                  {enrolled && !myReview && (
                    <button 
                      className="btn"
                      style={{ background: 'linear-gradient(135deg, #22d3ee, #06b6d4)', color: '#0f172a', fontWeight: '600' }}
                      onClick={() => setShowReviewForm(true)}
                    >
                      Write a Review
                    </button>
                  )}
                  {myReview && (
                    <button 
                      className="btn"
                      style={{ background: 'linear-gradient(135deg, #22d3ee, #06b6d4)', color: '#0f172a', fontWeight: '600' }}
                      onClick={() => {
                        setReviewData({ rating: myReview.rating, comment: myReview.comment });
                        setShowReviewForm(true);
                      }}
                    >
                      Edit Review
                    </button>
                  )}
                </div>

                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                    <h5 style={{ color: '#0f172a', marginBottom: '1rem' }}>{myReview ? 'Edit Your Review' : 'Write a Review'}</h5>
                    <div className="mb-3">
                      <label style={{ color: '#0f172a', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>Rating</label>
                      <div>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewData({ ...reviewData, rating: star })}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: star <= reviewData.rating ? '#fbbf24' : '#cbd5e1' }}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label style={{ color: '#0f172a', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>Comment (optional)</label>
                      <textarea
                        value={reviewData.comment}
                        onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                        placeholder="Share your experience..."
                        className="form-control"
                        rows="3"
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn" style={{ background: 'linear-gradient(135deg, #22d3ee, #06b6d4)', color: '#0f172a', fontWeight: '600' }}>
                        {myReview ? 'Update' : 'Submit'}
                      </button>
                      {myReview && (
                        <button type="button" onClick={handleDeleteReview} className="btn btn-danger">
                          Delete
                        </button>
                      )}
                      <button type="button" onClick={() => setShowReviewForm(false)} className="btn btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {reviews.length > 0 ? (
                  <div>
                    {reviews.map(review => (
                      <div key={review._id} style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                        <div className="d-flex align-items-center mb-2">
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #22d3ee, #06b6d4)', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', marginRight: '0.75rem' }}>
                            {review.student?.name?.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: '#0f172a' }}>{review.student?.name || 'Student'}</div>
                            <div style={{ color: '#fbbf24', fontSize: '0.875rem' }}>{'★'.repeat(review.rating)}</div>
                          </div>
                        </div>
                        {review.comment && <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="card" style={{ position: 'sticky', top: '100px' }}>
              <div className="card-body" style={{ padding: '2rem' }}>
                <div className="text-center mb-4">
                  <span style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0f172a' }}>${course.price}</span>
                  {course.averageRating > 0 && (
                    <div style={{ color: '#fbbf24', fontSize: '1rem', marginTop: '0.5rem' }}>
                      {course.averageRating} ★ ({course.totalReviews} reviews)
                    </div>
                  )}
                </div>

                {user?.role === 'admin' || user?.role === 'instructor' ? (
                  <div className="alert" style={{ background: 'var(--bg-light)', border: 'none', padding: '1rem' }}>
                    <p style={{ marginBottom: '0.5rem', fontWeight: '500', color: 'var(--primary-blue)' }}>👀 Preview Mode</p>
                  </div>
                ) : enrolled ? (
                  <button className="btn w-100 mb-2" style={{ background: '#28a745', color: 'white', fontWeight: '600' }}>✓ Enrolled</button>
                ) : (
                  <button className="btn btn-accent w-100" onClick={handleEnroll} style={{ fontWeight: '600' }}>Enroll Now</button>
                )}

                <hr style={{ margin: '1.5rem 0' }} />
                <div>
                  <p style={{ fontWeight: '600', marginBottom: '1rem', color: 'var(--primary-blue)' }}>This course includes:</p>
                  <ul className="list-unstyled" style={{ color: 'var(--text-muted)' }}>
                    <li className="mb-2"><span style={{ color: '#ff7f40', marginRight: '0.5rem' }}>✓</span>{course.lessons?.length || 0} lessons</li>
                    {course.lessons?.some(l => l.videoUrl) && (
                      <li className="mb-2"><span style={{ color: '#ff7f40', marginRight: '0.5rem' }}>✓</span>Video lessons</li>
                    )}
                    <li className="mb-2"><span style={{ color: '#ff7f40', marginRight: '0.5rem' }}>✓</span>Full lifetime access</li>
                    <li className="mb-2"><span style={{ color: '#ff7f40', marginRight: '0.5rem' }}>✓</span>Certificate of completion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="text-center">
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.5)' }}>&copy; 2024 Learnix. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {showPayment && (
        <PaymentModal
          course={course}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default CourseDetail;
