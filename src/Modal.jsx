const Modal = ({ handleClose, handleSubmit, show, children, submitbtn }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <div
          style={{
            display: "flex",
            gap: "5px",
            justifyContent: "center",
            margin: "0.5em",
          }}
        >
          {submitbtn ? (
            <button type="button" onClick={handleSubmit}>
              Submit
            </button>
          ) : null}
          <button type="button" onClick={handleClose}>
            Close
          </button>
        </div>
      </section>
    </div>
  );
};

export default Modal;
