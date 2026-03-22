import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Collapsible from "../components/Collapsible";

describe("Collapsible", () => {
  it("always renders the header", () => {
    render(
      <Collapsible header="My Header" isOpen={false} onToggle={() => {}}>
        <div>Body content</div>
      </Collapsible>
    );
    expect(screen.getByText("My Header")).toBeInTheDocument();
  });

  it("does not render children when closed", () => {
    render(
      <Collapsible header="My Header" isOpen={false} onToggle={() => {}}>
        <div>Body content</div>
      </Collapsible>
    );
    expect(screen.queryByText("Body content")).not.toBeInTheDocument();
  });

  it("renders children when open", () => {
    render(
      <Collapsible header="My Header" isOpen={true} onToggle={() => {}}>
        <div>Body content</div>
      </Collapsible>
    );
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("calls onToggle when header is clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <Collapsible header="My Header" isOpen={false} onToggle={onToggle}>
        <div>Body content</div>
      </Collapsible>
    );
    await user.click(screen.getByText("My Header"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("shows expand_more icon when open", () => {
    render(
      <Collapsible header="My Header" isOpen={true} onToggle={() => {}}>
        <div>Body content</div>
      </Collapsible>
    );
    expect(screen.getByText("expand_more")).toBeInTheDocument();
  });

  it("shows chevron_right icon when closed", () => {
    render(
      <Collapsible header="My Header" isOpen={false} onToggle={() => {}}>
        <div>Body content</div>
      </Collapsible>
    );
    expect(screen.getByText("chevron_right")).toBeInTheDocument();
  });
});
