import { useEffect } from "react";
import { BinarySearchTree, Node } from "../../utils/tree";
import {
  fillColor,
  nodeDistance,
  nodeRadius,
  selectedFillColor,
  strokeColor,
  textDistance,
} from "./constants";

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

    if (Elements.length) {
      for (let index = Elements.length - 1; index >= 0; index--) {
        const { cx, cy, node } = Elements[index];
        var dx = cx - clickX;
        var dy = cy - clickY;

        if (dx * dx + dy * dy <= nodeRadius * nodeRadius) {
          return node;
        }
      }
    }
    return false;
  }

  function drawNode(centerX: number, centerY: number, isSelected: boolean) {
    const { context } = getCanvasAndContext();

    context.beginPath();
    context.arc(centerX, centerY, nodeRadius, 0, 2 * Math.PI);
    context.fillStyle = isSelected ? selectedFillColor : fillColor;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = strokeColor;
    context.stroke();
  }

  function addText(centerX: number, centerY: number, value: string) {
    const { context } = getCanvasAndContext();

    context.beginPath();
    context.fillStyle = strokeColor;
    context.font = "1200px";
    context.fillText(
      value,
      centerX - textDistance - value.length,
      centerY + textDistance
    );
    context.fill();
  }

  function drawEdge(centerY: number, lineToX: number, moveToX: number) {
    const { context } = getCanvasAndContext();

    context.beginPath();
    context.moveTo(moveToX, centerY);
    context.lineTo(lineToX, centerY + nodeDistance);
    context.stroke();
  }

  function draw(
    node: Node | null,
    posX: number | null,
    posY: number | null,
    depth = 1
  ) {
    if (node) {
      const { value, left, right, isSelected } = node;
      const { canvas } = getCanvasAndContext();

      const center = posX ? posX : canvas.width / 2;
      const centerX = center;

      const centerY = posY ? posY : 20;

      drawNode(centerX, centerY, isSelected);

      addText(centerX, centerY, value);

      Elements.push({ cx: centerX, cy: centerY, node });

      const edgeDirection = nodeDistance * depth;
      if (left) {
        drawEdge(centerY, centerX - edgeDirection, centerX - nodeRadius);

        draw(left, centerX - edgeDirection, centerY + nodeDistance, depth / 2);
      }
      if (right) {
        drawEdge(centerY, centerX + edgeDirection, centerX + nodeRadius);

        draw(right, centerX + edgeDirection, centerY + nodeDistance, depth / 2);
      }
    }
  }

  useEffect(() => {
    const { canvas, context } = getCanvasAndContext();
    BST.createCompleteBinaryTreeFromArray(treeNodes);

    if (BST.root?.value && treeNodes.length) {
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
    const { canvas } = getCanvasAndContext();

    canvas.width = document.body.clientWidth - 20;
    canvas.height = 450;

    canvas.addEventListener("mousedown", mouseDown);
    return () => {
      canvas.removeEventListener("mousedown", mouseDown);
    };
  }, []);

  return (
    <div id="canvas-container" style={{ marginTop: "8px" }}>
      <canvas id="canvas" style={{ border: "1px solid black" }}></canvas>
    </div>
  );
}
