import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "../components/Modal";

// jsdom does not implement HTMLDialogElement.showModal/close
beforeEach(() => {
  HTMLDialogElement.prototype.showModal =
    HTMLDialogElement.prototype.showModal ||
    function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
  HTMLDialogElement.prototype.close =
    HTMLDialogElement.prototype.close ||
    function (this: HTMLDialogElement) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    };
});

describe("Modal", () => {
  it("renders children when open", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("calls showModal when isOpen becomes true", () => {
    const showModal = vi.fn();
    HTMLDialogElement.prototype.showModal = showModal;

    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Content</div>
      </Modal>
    );
    expect(showModal).toHaveBeenCalled();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );
    await user.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalled();
  });

  it("renders a close button in the footer", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Content</div>
      </Modal>
    );
    expect(screen.getByText("Close")).toBeInTheDocument();
  });
});
