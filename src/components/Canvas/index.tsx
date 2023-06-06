//@ts-nocheck

import { useEffect, useState } from "react";
import { createCompleteBinaryTreeFromArray, INode } from "../../utils/tree";

interface IBinaryTreeCanvasProps {
  treeNodes: string[];
}

let Elements = [];

export default function BinaryTreeCanvas(props: IBinaryTreeCanvasProps) {
  const { treeNodes } = props;

  function getActiveObject(event) {
    var canvas = document.getElementById("lower-canvas");

    var offsetX = canvas.getBoundingClientRect().left;
    var offsetY = canvas.getBoundingClientRect().top;

    const clickX = event.pageX - offsetX;
    const clickY = event.pageY - offsetY;

    const r = 15;

    if (Elements.length) {
      for (let index = Elements.length - 1; index >= 0; index--) {
        const { cx, cy } = Elements[index];
        var dx = cx - clickX;
        var dy = cy - clickY;

        console.log(
          "AAA",
          Math.sqrt(dx * dx + dy * dy) <= r * r,
          r * r,
          Math.sqrt(dx * dx + dy * dy)
        );
        if (dx * dx + dy * dy <= r * r) {
          alert("you are inside the circle");
        }
        // if (
        //   pointX >= elements[index].top &&
        //   pointY >= elements[index].left &&
        //   pointX <= elements[index].width + elements[index].top &&
        //   pointY <= elements[index].height + elements[index].left
        // ) {
        //   elements[index].isSelected = true;
        //   console.log("aaaaaaaa", elements[index]);
        //   //   activeObject = Object.assign({}, elements[index]);
        //   return true;
        // }
      }
    }
    return false;
  }

  function draw(
    node: INode,
    posX: number | null,
    posY: number | null,
    depth = 1
  ) {
    const { value, left, right } = node;
    const canvas = document.getElementById("lower-canvas");
    const context = canvas.getContext("2d");

    const center = posX ? posX : canvas.width / 2;
    const centerX = center;
    const radius = 15;
    const centerY = posY ? posY : 20;

    // Draw circle
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = "black";
    context.stroke();

    //Fill number in it
    context.beginPath();
    context.fillStyle = "black";
    context.font = "bold 24px ";
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

  useEffect(() => {
    const canvas = document.getElementById("lower-canvas");
    const context = canvas.getContext("2d");
    const result = createCompleteBinaryTreeFromArray(treeNodes);

    if (result.root?.value) {
      const depth = result.maxDepth(result.root);
      Elements = [];
      context.clearRect(0, 0, canvas.width, canvas.height);
      draw(result.root, null, null, depth);
    } else {
      Elements = [];
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [treeNodes]);

  function mouseDown(event) {
    const canvas = document.getElementById("lower-canvas");
    const ctx = canvas.getContext("2d");

    if (ctx.isPointInPath(circle, event.clientX, event.clientY)) {
      alert("you are inside the circle");
    }
  }

  useEffect(() => {
    const canvas = document.getElementById("lower-canvas");

    canvas.addEventListener("mousedown", mouseDown);
  }, []);

  return (
    <div id="canvas-container" style={{ marginTop: "8px", width: "100%" }}>
      <canvas
        id="lower-canvas"
        style={{ border: "1px solid black", width: "98%" }}
        width="1000"
        height="400"
      ></canvas>
    </div>
  );
}
