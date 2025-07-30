
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
  const vietQRUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;

  if (!show) return null;

  // Main Donate Screen
  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-gradient text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <h4 className="modal-title">
              <i className="fa-solid fa-heart text-danger me-2 fa-beat"></i>
              Ủng hộ phát triển dự án
            </h4>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onHide}
              title="Đóng"
            ></button>
          </div>
          <div className="modal-body p-4">
            
            <div className="row justify-content-center">
              {/* VietQR Code */}
              <div className="col-md-8 col-lg-6 text-center mb-4">
                <div className="qr-container">
                  <div className="qr-code-wrapper vietqr p-4 border border-3 border-success rounded-4 d-inline-block bg-white shadow-lg">
                    <img 
                      src={vietQRUrl}
                      alt="VietQR Code Donate"
                      className="img-fluid rounded-2"
                      style={{ width: '250px', height: '250px' }}
                      onError={(e) => {
                        // Fallback to manual QR if VietQR fails
                        e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`Bank: VietinBank\nAccount: ${accountNumber}\nName: ${accountName}\nContent: ${description}`)}&bgcolor=ffffff&color=000000`;
                      }}
                    />
                  </div>
                  <div className="mt-3">
                    <span className="badge bg-success fs-6 px-3 py-2">
                      <i className="fa-solid fa-qrcode me-1"></i>
                      QR Banking
                    </span>
                  </div>
                  <div className="mt-2">
                    <small className="text-muted d-block">
                      <strong>VietinBank:</strong> {accountNumber}
                    </small>
                    <small className="text-muted d-block">
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
                  style={{ width: '600px', height: '200px', objectFit: 'cover' }}
                />
              </div>
            </div>

        
          </div>
          <div className="modal-footer text-center py-3" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', borderRadius: '0 0 20px 20px' }}>
            <div className="w-100">
              <div className="mb-3">
                <p className="text-muted mb-2">
                  <i className="fa-solid fa-heart text-danger me-1 fa-beat"></i>
                  <strong>Cảm ơn những người đã ủng hộ dự án</strong>
                </p>
                <small className="text-muted">
                  Sự hỗ trợ của mọi người là động lực để mình tiếp tục phát triển
                </small>
              </div>
              
              <div className="d-flex justify-content-center gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={onHide}>
                  <i className="fa-solid fa-times me-1"></i>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
