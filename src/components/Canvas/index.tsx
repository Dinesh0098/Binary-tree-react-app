import { useEffect } from "react";
import { BinarySearchTree, Node } from "../../utils/tree";

interface IBinaryTreeCanvasProps {
  treeNodes: string[];
}

type ElementType = { cx: number; cy: number; node: Node };

let Elements: Array<ElementType> = [];
const BST = new BinarySearchTree();

export default function BinaryTreeCanvas(props: IBinaryTreeCanvasProps) {
  const { treeNodes } = props;

  function getCanvasAndContext() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    return { canvas, context };
  }

  function getActiveObject(event: MouseEvent) {
    const { canvas } = getCanvasAndContext();

    const { left, top } = canvas.getBoundingClientRect();

    const clickX = event.pageX - left;
    const clickY = event.pageY - top;

    const r = 15;

    if (Elements.length) {
      for (let index = Elements.length - 1; index >= 0; index--) {
        const { cx, cy, node } = Elements[index];
        var dx = cx - clickX;
        var dy = cy - clickY;

        if (dx * dx + dy * dy <= r * r) {
          return node;
        }
      }
    }
    return false;
  }

  function draw(
    node: Node | null,
    posX: number | null,
    posY: number | null,
    depth = 1
  ) {
    if (node) {
      const { value, left, right, isSelected } = node;
      const { canvas, context } = getCanvasAndContext();

      const center = posX ? posX : canvas.width / 2;
      const centerX = center;
      const radius = 15;
      const centerY = posY ? posY : 20;

      // Draw circle
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      context.fillStyle = isSelected ? "#17AABF" : "white";
      context.fill();
      context.lineWidth = 1;
      context.strokeStyle = "black";
      context.stroke();

      //Fill number in it
      context.beginPath();
      context.fillStyle = "black";
      context.font = "bold 24pt ";
      context.fillText(value, centerX - 4, centerY + 4);
      context.fill();

      Elements.push({ cx: centerX, cy: centerY, node });

      const some = 50 * depth;
      if (left) {
        context.beginPath();
        context.moveTo(centerX - 15, centerY);
        context.lineTo(centerX - some, centerY + 50);
        context.stroke();
        draw(left, centerX - some, centerY + 50, depth / 2);
      }
      if (right) {
        context.beginPath(); // Start a new path
        context.moveTo(centerX + 15, centerY); // Move the pen to (30, 50)
        context.lineTo(centerX + some, centerY + 50); // Draw a line to (150, 100)
        context.stroke();
        draw(right, centerX + some, centerY + 50, depth / 2);
      }
    }
  }

  useEffect(() => {
    const { canvas, context } = getCanvasAndContext();
    BST.createCompleteBinaryTreeFromArray(treeNodes);

    if (BST.root?.value) {
      BST.maxDepth(BST.root);

      Elements = [];
      context.clearRect(0, 0, canvas.width, canvas.height);
      draw(BST.root, null, null, BST.depth);
    } else {
      Elements = [];
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [treeNodes]);

  function mouseDown(event: MouseEvent) {
    const { canvas, context } = getCanvasAndContext();

    const activeObj = getActiveObject(event);

    if (activeObj) {
      if (BST.root) {
        BST.clearPreviousSelection(BST.root);
      }
      BST.activateParents(activeObj);
      setTimeout(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);

        draw(BST.root, null, null, BST.depth);
      }, 0);
    } else {
      if (BST.root) {
        BST.clearPreviousSelection(BST.root);
      }
    }
  }

  useEffect(() => {
    const canvas: HTMLElement | null = document.getElementById("canvas");

    canvas?.addEventListener("mousedown", mouseDown);
    return () => {
      canvas?.removeEventListener("mousedown", mouseDown);
    };
  }, []);

  return (
    <div id="canvas-container" style={{ marginTop: "8px", width: "100%" }}>
      <canvas
        id="canvas"
        style={{ border: "1px solid black" }}
        width="1000"
        height="400"
      ></canvas>
    </div>
  );
}
