import { render, screen } from "@testing-library/react";
import { LoadingMotes } from "@/components/LoadingMotes";

describe("LoadingMotes", () => {
  it("renders with loading role and testid", () => {
    render(<LoadingMotes />);
    expect(screen.getByTestId("loading-motes")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has accessible label", () => {
    render(<LoadingMotes />);
    expect(screen.getByText("Thinking...")).toBeInTheDocument();
  });

  it("renders three pulsing motes", () => {
    const { container } = render(<LoadingMotes />);
    const motes = container.querySelectorAll(".loading-mote");
    expect(motes).toHaveLength(3);
  });

  it("staggers animation delays across motes", () => {
    const { container } = render(<LoadingMotes />);
    const motes = container.querySelectorAll(".loading-mote");
    const delays = Array.from(motes).map(
      (m) => (m as HTMLElement).style.animationDelay
    );
    expect(delays).toEqual(["0s", "0.2s", "0.4s"]);
  });
});
