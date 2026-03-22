import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tabs from "../components/Tabs";

const tabs = [
  { id: "tab-a", label: "Tab A" },
  { id: "tab-b", label: "Tab B" },
  { id: "tab-c", label: "Tab C" },
];

describe("Tabs", () => {
  it("renders all tab labels", () => {
    render(<Tabs tabs={tabs} activeTab="tab-a" onTabChange={() => {}} />);
    expect(screen.getByText("Tab A")).toBeInTheDocument();
    expect(screen.getByText("Tab B")).toBeInTheDocument();
    expect(screen.getByText("Tab C")).toBeInTheDocument();
  });

  it("marks the active tab", () => {
    render(<Tabs tabs={tabs} activeTab="tab-b" onTabChange={() => {}} />);
    expect(screen.getByText("Tab B")).toHaveClass("active");
    expect(screen.getByText("Tab A")).not.toHaveClass("active");
  });

  it("calls onTabChange when a tab is clicked", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(<Tabs tabs={tabs} activeTab="tab-a" onTabChange={onTabChange} />);
    await user.click(screen.getByText("Tab C"));
    expect(onTabChange).toHaveBeenCalledWith("tab-c");
  });
});
