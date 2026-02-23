import { render, screen, fireEvent } from "@testing-library/react";
import { SoundToggle } from "@/components/SoundToggle";

describe("SoundToggle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders with Sound off by default", () => {
    render(<SoundToggle />);
    expect(screen.getByTestId("sound-toggle")).toBeInTheDocument();
    expect(screen.getByText("Sound off")).toBeInTheDocument();
  });

  it("toggles label when clicked", () => {
    render(<SoundToggle />);
    const btn = screen.getByTestId("sound-toggle");
    fireEvent.click(btn);
    expect(screen.getByText("Sound on")).toBeInTheDocument();
    fireEvent.click(btn);
    expect(screen.getByText("Sound off")).toBeInTheDocument();
  });

  it("has accessible label", () => {
    render(<SoundToggle />);
    expect(screen.getByRole("button", { name: /turn forest sound on/i })).toBeInTheDocument();
  });
});
