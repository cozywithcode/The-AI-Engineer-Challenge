import { render } from "@testing-library/react";
import { SunRaysOverlay } from "@/components/SunRaysOverlay";

describe("SunRaysOverlay", () => {
  it("renders cascade wash, beams, and rays", () => {
    const { container } = render(<SunRaysOverlay />);
    expect(container.querySelector(".cascade-wash")).toBeInTheDocument();
    expect(
      container.querySelectorAll(".cascade-beam").length
    ).toBeGreaterThan(0);
    expect(
      container.querySelectorAll(".cascade-ray").length
    ).toBeGreaterThan(0);
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<SunRaysOverlay />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute("aria-hidden");
  });

  it("renders 5 beams and 7 rays", () => {
    const { container } = render(<SunRaysOverlay />);
    expect(container.querySelectorAll(".cascade-beam")).toHaveLength(5);
    expect(container.querySelectorAll(".cascade-ray")).toHaveLength(7);
  });

  it("staggers beam animation delays in ascending order", () => {
    const { container } = render(<SunRaysOverlay />);
    const beams = container.querySelectorAll(".cascade-beam");
    const delays = Array.from(beams).map((b) =>
      Math.round(parseFloat((b as HTMLElement).style.animationDelay) * 100)
    );
    expect(delays).toEqual([0, 10, 20, 30, 40]);
  });
});
