
interface DonateModalProps {
  show: boolean;
  onHide: () => void;
}

export default function DonateModal({ show, onHide }: DonateModalProps) {
  // VietQR parameters - Thay đổi thông tin này theo tài khoản thật
  const bankCode = "970415";
  const accountNumber = "104875883096"; // Số tài khoản thật
  const template = "compact";
  const amount = ""; // Để trống cho người dùng tự nhập
  const description = "Ung ho du an TKB SGU";
  const accountName = "NGUYEN CONG QUAN";
  
  // VietQR URL
  const vietQRUrl =`https://img.vietqr.io/image/${bankCode}-${accountNumber}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;

  if (!show) return null;

  // Main Donate Screen
  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="modal-dialog modal-dialog-centered modal-md"> {/* Đổi từ modal-lg sang modal-md */}
        <div className="modal-content" style={{
          backgroundColor: 'var(--surface-color)',
          borderBottom: '5px solid var(text-primary)',
          borderRadius: '12px' // Giảm từ 16px xuống 12px
        }}>
          <div className="modal-header text-white" style={{ 
            // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px 12px 0 0', // Giảm từ 16px xuống 12px
            borderBottom: '1px solid var(--border-color)',
            padding: '12px 16px' // Giảm padding
          }}>
            <h5 className="modal-title mb-0"> {/* Đổi từ h4 sang h5 */}
              <i className="fa-solid fa-heart text-danger me-2 fa-beat" style={{ fontSize: '16px' }}></i> {/* Giảm font size */}
              Ủng hộ dự án
            </h5>
           <button 
                  type="button" 
                  className="btn btn-sm" // Thêm btn-sm
                  onClick={onHide}
                  style={{
                    backgroundColor: 'var(--border-color)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '4px 8px' // Giảm padding
                  }}
                >
                  <i className="fa-solid fa-times"></i> {/* Bỏ me-1 và text */}
                </button>
          </div>
          <div className="modal-body p-3" style={{ // Giảm padding từ p-4 xuống p-3
            backgroundColor: 'var(--surface-color)',
            color: 'var(--text-primary)'
          }}>
            
            <div className="row justify-content-center">
              {/* VietQR Code */}
              <div className="col-md-8 col-lg-6 text-center mb-3"> {/* Giảm từ mb-4 xuống mb-3 */}
                <div className="qr-container">
                  <div className="qr-code-wrapper vietqr p-3 border border-3 rounded-4 d-inline-block shadow-lg" style={{ // Giảm padding từ p-4 xuống p-3
                    backgroundColor: 'var(--background-color)',
                    borderColor: 'var(--success-color) !important'
                  }}>
                    <img 
                      src={vietQRUrl}
                      alt="VietQR Code Donate"
                      className="img-fluid rounded-2"
                      style={{ width: '300px', height: '200px' }}
                      onError={(e) => {
                        // Fallback to manual QR if VietQR fails
                        e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x200&data=${encodeURIComponent(`Bank: VietinBank\nAccount: ${accountNumber}\nName: ${accountName}\nContent: ${description}`)}&bgcolor=ffffff&color=000000`;
                      }}
                    />
                  </div>
                  <div className="mt-2"> {/* Giảm từ mt-3 xuống mt-2 */}
                    <span className="badge px-2 py-1" style={{ // Giảm padding từ px-3 py-2 xuống px-2 py-1
                      backgroundColor: 'var(--success-color)',
                      color: 'var(--background-color)',
                      fontSize: '0.8rem' // Thêm font size nhỏ hơn
                    }}>
                      <i className="fa-solid fa-qrcode me-1"></i>
                      QR Banking
                    </span>
                  </div>
                  <div className="mt-2">
                    <small className="d-block" style={{ color: 'var(--text-secondary)' }}>
                      <strong>VietinBank:</strong> {accountNumber}
                    </small>
                    <small className="d-block" style={{ color: 'var(--text-secondary)' }}>
                      <strong>Chủ TK:</strong> {accountName}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Thank you message */}
            <div className="text-center">
              <div>
                <img 
                  src="/g.gif" // Adjust path as needed
                  alt="Coffee Support"
                  className="img-fluid rounded-3 shadow-sm"
                  style={{ width: '400px', height: '150px', objectFit: 'cover' }} // Giảm kích thước từ 600x200 xuống 400x150
                />
              </div>
            </div>

        
          </div>
          <div className="modal-footer text-center py-2" style={{ // Giảm padding từ py-3 xuống py-2
            background: 'var(--surface-color)', 
            borderTop: '1px solid var(--border-color)',
            borderRadius: '0 0 12px 12px', // Giữ nguyên 12px như header
            color: 'var(--text-primary)'
          }}>
            <div className="w-100">
              <div className="mb-2"> {/* Giảm từ mb-3 xuống mb-2 */}
                <p className="mb-1" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}> {/* Giảm từ mb-2 xuống mb-1 và thêm font size */}
                  <i className="fa-solid fa-heart text-danger me-1 fa-beat"></i>
                  <strong>Cảm ơn những người đã ủng hộ dự án</strong>
                </p>
                <small style={{ color: 'var(--text-secondary)' }}>
                  Sự hỗ trợ của mọi người là động lực để mình tiếp tục phát triển
                </small>
                <br />
                <small style={{ color: 'var(--text-secondary)' }}>
                  Liên hệ: <a href="http://facebook.com/cucngau.quan" target="_blank" rel="noopener noreferrer">Quân</a>
                </small>
              </div>
              
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
