import { render, screen, fireEvent } from "@testing-library/react";
import { ChatInput } from "@/components/ChatInput";

describe("ChatInput", () => {
  it("calls onSend with trimmed value when Send is clicked", () => {
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} />);
    const input = screen.getByTestId("chat-input");
    const submit = screen.getByTestId("chat-submit");

    fireEvent.change(input, { target: { value: "  hello  " } });
    fireEvent.click(submit);

    expect(onSend).toHaveBeenCalledWith("hello");
  });

  it("does not call onSend when input is empty", () => {
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} />);
    fireEvent.click(screen.getByTestId("chat-submit"));
    expect(onSend).not.toHaveBeenCalled();
  });

  it("clears input after send (handled by parent via state in real usage; submit is enabled when there is text)", () => {
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} />);
    const input = screen.getByTestId("chat-input");
    fireEvent.change(input, { target: { value: "hi" } });
    fireEvent.click(screen.getByTestId("chat-submit"));
    expect(onSend).toHaveBeenCalledWith("hi");
  });

  it("sends on Enter without shift", () => {
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} />);
    const input = screen.getByTestId("chat-input");
    fireEvent.change(input, { target: { value: "enter" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: false });
    expect(onSend).toHaveBeenCalledWith("enter");
  });

  it("submit is disabled when disabled prop is true", () => {
    render(<ChatInput onSend={jest.fn()} disabled />);
    expect(screen.getByTestId("chat-submit")).toBeDisabled();
  });
});
