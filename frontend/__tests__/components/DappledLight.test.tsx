import { render } from "@testing-library/react";
import { DappledLight } from "@/components/DappledLight";

describe("DappledLight", () => {
  it("renders dappled light patches", () => {
    const { container } = render(<DappledLight />);
    const patches = container.querySelectorAll(".dappled-patch");
    expect(patches.length).toBeGreaterThan(0);
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<DappledLight />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute("aria-hidden");
  });

  it("is non-interactive (pointer-events-none)", () => {
    const { container } = render(<DappledLight />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("pointer-events-none");
  });

  it("renders exactly 8 patches", () => {
    const { container } = render(<DappledLight />);
    const patches = container.querySelectorAll(".dappled-patch");
    expect(patches).toHaveLength(8);
  });
});
