import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../utils/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  IdentificationIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  UserIcon,
  QrCodeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const IdCard = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardRef = useRef(null);

  // Fetch student ID card data from API
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await studentAPI.getIdCardData();
        console.log('ID Card Data Response:', response); // Debug log
        
        // Handle the nested response structure
        const data = response.data?.data || response.data;
        console.log('Extracted Data:', data); // Debug log
        
        setStudentData(data);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      // Convert to canvas with better quality settings
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 380,
        height: 540,
        logging: false
      });
      
      // Create PDF - Portrait orientation for vertical ID card
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [95, 135] // Adjusted for new card format
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, 95, 135);
      
      // Download the PDF
      pdf.save(`${studentData?.studentId || 'student'}_id_card.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintCard = () => {
    const printContent = cardRef.current;
    if (!printContent) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Student ID Card - ${studentData?.name || 'Student'}</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: system-ui, -apple-system, sans-serif; 
              background: white;
            }
            .print-container {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 80vh;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .print-container { min-height: 100vh; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${printContent.outerHTML}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your ID card...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Error Loading ID Card</h2>
          <p className="text-neutral-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="card p-8 bg-gradient-to-br from-primary-600 to-secondary-600 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <IdentificationIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    Student ID Card
                  </h1>
                  <p className="text-white/90 text-lg">
                    Your official student identification card
                  </p>
                </div>
              </div>
            </div>
            
            {/* Background Decorations */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary-300/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* ID Card Preview */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">ID Card Preview</h2>
              <p className="text-neutral-600">Your official student identification card</p>
            </div>

            {/* Enhanced ID Card Design with Better Spacing */}
            <div className="flex justify-center">
              <div 
                ref={cardRef} 
                className="transform hover:scale-105 transition-all duration-300 hover:shadow-2xl bg-white relative"
                style={{
                  width: '380px',
                  height: '540px',
                  borderRadius: '20px',
                  boxShadow: '0 15px 40px rgba(79, 70, 229, 0.2)',
                  overflow: 'hidden',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                {/* Background Abstract Elements */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '200px',
                  height: '200px',
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                  borderRadius: '50%',
                  filter: 'blur(40px)'
                }} />
                
                <div style={{
                  position: 'absolute',
                  bottom: '-100px',
                  left: '-100px',
                  width: '250px',
                  height: '250px',
                  background: 'linear-gradient(45deg, rgba(147, 51, 234, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)',
                  borderRadius: '50%',
                  filter: 'blur(60px)'
                }} />

                {/* Top Header Section */}
                <div style={{
                  background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
                  height: '140px',
                  position: 'relative',
                  clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)'
                }}>
                  {/* Header Content */}
                  <div style={{
                    padding: '25px 30px',
                    color: 'white',
                    position: 'relative',
                    zIndex: 10
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <AcademicCapIcon style={{ width: '28px', height: '28px', color: 'white' }} />
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          margin: 0,
                          letterSpacing: '1px'
                        }}>
                          JANASHIRI INSTITUTE
                        </h3>
                        <p style={{
                          fontSize: '12px',
                          margin: '4px 0 0 0',
                          opacity: 0.9,
                          fontWeight: '500'
                        }}>
                          Excellence in Education
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Abstract Pattern in Header */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '20px',
                    width: '80px',
                    height: '80px',
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    opacity: 0.3
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '30px',
                    right: '40px',
                    width: '40px',
                    height: '40px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    opacity: 0.4
                  }} />
                </div>

                {/* Student Photo Section */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '-60px',
                  position: 'relative',
                  zIndex: 20
                }}>
                  <div style={{
                    width: '130px',
                    height: '130px',
                    borderRadius: '50%',
                    border: '5px solid white',
                    overflow: 'hidden',
                    background: '#f8fafc',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    position: 'relative'
                  }}>
                    {studentData?.photoUrl ? (
                      <img
                        src={studentData.photoUrl}
                        alt={studentData.name || 'Student'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          console.log('Photo failed to load:', studentData.photoUrl);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div style={{
                      display: studentData?.photoUrl ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      color: '#94a3b8',
                      background: '#f1f5f9'
                    }}>
                      <UserIcon style={{ width: '50px', height: '50px' }} />
                    </div>
                  </div>
                </div>

                {/* Student Information Section */}
                <div style={{
                  padding: '30px 35px 20px',
                  textAlign: 'center'
                }}>
                  {/* Name and Course */}
                  <div style={{ marginBottom: '25px' }}>
                    <h2 style={{
                      fontSize: '26px',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: '0 0 8px 0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      lineHeight: '1.2'
                    }}>
                      {studentData?.name || 'STUDENT NAME'}
                    </h2>
                    <p style={{
                      fontSize: '16px',
                      color: '#4F46E5',
                      margin: 0,
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {studentData?.standard || 'Course Name'}
                    </p>
                  </div>

                  {/* Student Details Grid */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '25px'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      gap: '12px',
                      fontSize: '15px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0'
                      }}>
                        <span style={{
                          fontWeight: '600',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <IdentificationIcon style={{ width: '18px', height: '18px', marginRight: '8px', color: '#4F46E5' }} />
                          Student ID
                        </span>
                        <span style={{ 
                          color: '#1e293b', 
                          fontWeight: '600',
                          background: '#e0e7ff',
                          padding: '4px 12px',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}>
                          {studentData?.studentId || 'STU0000'}
                        </span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0'
                      }}>
                        <span style={{
                          fontWeight: '600',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <CalendarDaysIcon style={{ width: '18px', height: '18px', marginRight: '8px', color: '#4F46E5' }} />
                          Phone
                        </span>
                        <span style={{ 
                          color: '#1e293b', 
                          fontWeight: '500',
                          fontSize: '14px'
                        }}>
                          {studentData?.mobile || '+91 98765 43210'}
                        </span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0'
                      }}>
                        <span style={{
                          fontWeight: '600',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <UserIcon style={{ width: '18px', height: '18px', marginRight: '8px', color: '#4F46E5' }} />
                          Blood Group
                        </span>
                        <span style={{ 
                          color: '#dc2626', 
                          fontWeight: '600',
                          background: '#fef2f2',
                          padding: '4px 12px',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}>
                          {studentData?.bloodGroup || 'O+'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Issue Information */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                    color: '#64748b',
                    marginBottom: '20px',
                    padding: '12px 16px',
                    background: 'rgba(79, 70, 229, 0.05)',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <strong>Issued:</strong> {studentData?.issueDate || new Date().toLocaleDateString('en-IN')}
                    </div>
                    <div>
                      <strong>Valid Until:</strong> {studentData?.validUntil || '2025'}
                    </div>
                  </div>

                  {/* Signature Section */}
                  <div style={{
                    borderTop: '2px dashed #cbd5e1',
                    paddingTop: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontStyle: 'italic',
                      color: '#475569',
                      marginBottom: '15px',
                      fontFamily: 'cursive'
                    }}>
                      Authorized Signature
                    </div>
                    <div style={{
                      height: '40px',
                      borderBottom: '2px solid #e2e8f0',
                      marginBottom: '8px',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        right: '0',
                        bottom: '10px',
                        fontSize: '12px',
                        color: '#94a3b8',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <QrCodeIcon style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                        Verified
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Back Preview */}
            <div className="flex justify-center">
              <div style={{
                width: '350px',
                height: '220px',
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                color: '#374151'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '8px', fontSize: '14px' }}>
                    Important Instructions
                  </h4>
                </div>
                <div style={{ fontSize: '10px', lineHeight: '1.4', color: '#4b5563' }}>
                  <div style={{ marginBottom: '6px' }}>• This card is the property of Janashiri Institute</div>
                  <div style={{ marginBottom: '6px' }}>• Must be carried at all times on campus</div>
                  <div style={{ marginBottom: '6px' }}>• Report loss immediately to administration</div>
                  <div style={{ marginBottom: '6px' }}>• Valid for current academic year</div>
                  <div style={{ marginBottom: '6px' }}>• Non-transferable identification</div>
                </div>
                <div style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #d1d5db',
                  textAlign: 'center',
                  fontSize: '9px',
                  color: '#6b7280'
                }}>
                  <p>For queries: info@janashiriinstitute.edu</p>
                  <p>Emergency: +91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions and Information */}
          <div className="space-y-8">
            {/* Action Buttons */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-xl font-bold text-neutral-900">Download & Print</h3>
              </div>
              <div className="card-body space-y-4">
                <button
                  onClick={handleDownloadCard}
                  disabled={isGenerating}
                  className={`btn-primary w-full ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isGenerating ? (
                    <>
                      <div className="loading mr-2"></div>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                      Download ID Card (PDF)
                    </>
                  )}
                </button>
                
                <button
                  onClick={handlePrintCard}
                  className="btn-outline w-full"
                >
                  <PrinterIcon className="w-5 h-5 mr-2" />
                  Print ID Card
                </button>
                
                <div className="text-sm text-neutral-600 mt-4 p-4 bg-neutral-100 rounded-lg">
                  <p className="font-medium mb-2">💡 Tips:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Download as PDF for digital use</li>
                    <li>• Print on thick paper (200gsm recommended)</li>
                    <li>• Laminate for durability</li>
                    <li>• Keep a digital copy on your phone</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Student Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-xl font-bold text-neutral-900">Your Information</h3>
              </div>
              <div className="card-body space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Student ID</p>
                    <p className="text-lg font-semibold text-primary-600">
                      {studentData?.studentId || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Blood Group</p>
                    <p className="text-lg font-semibold text-red-600">
                      {studentData?.bloodGroup || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Course</p>
                    <p className="text-base font-medium text-neutral-900">
                      {studentData?.standard || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Valid Until</p>
                    <p className="text-base font-medium text-neutral-900">
                      {studentData?.validUntil || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <div className="flex items-center space-x-2 text-sm text-neutral-600">
                    <CalendarDaysIcon className="w-4 h-4" />
                    <span>Issued on: {studentData?.issueDate || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-xl font-bold text-neutral-900">Security Features</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-neutral-700">Holographic Design</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-neutral-700">Unique Student ID</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-neutral-700">Official Institute Seal</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-neutral-700">Tamper-Proof Material</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdCard;
