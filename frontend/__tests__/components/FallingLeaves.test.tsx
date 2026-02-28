import { render } from "@testing-library/react";
import { FallingLeaves } from "@/components/FallingLeaves";

describe("FallingLeaves", () => {
  it("renders leaf elements", () => {
    const { container } = render(<FallingLeaves />);
    const leaves = container.querySelectorAll(".falling-leaf");
    expect(leaves.length).toBeGreaterThan(0);
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<FallingLeaves />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute("aria-hidden");
  });

  it("renders leaves in multiple layers (different opacities)", () => {
    const { container } = render(<FallingLeaves />);
    const leaves = container.querySelectorAll(".falling-leaf");
    const opacities = new Set<string>();
    leaves.forEach((leaf) => {
      const style = (leaf as HTMLElement).style.opacity;
      if (style) opacities.add(style);
    });
    expect(opacities.size).toBeGreaterThan(1);
  });

  it("renders 14 leaves across all layers", () => {
    const { container } = render(<FallingLeaves />);
    const leaves = container.querySelectorAll(".falling-leaf");
    expect(leaves).toHaveLength(14);
  });
});
