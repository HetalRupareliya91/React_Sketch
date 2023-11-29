/* eslint-disable */
import React from "react";
import {
  CanvasPath,
  ExportImageType,
  ReactSketchCanvas,
  ReactSketchCanvasProps,
  ReactSketchCanvasRef,
} from "react-sketch-canvas";

type Handlers = [string, () => void, string][];

export interface InputFieldProps {
  fieldName: keyof ReactSketchCanvasProps;
  type?: string;
  canvasProps: Partial<ReactSketchCanvasProps>;
  setCanvasProps: React.Dispatch<
    React.SetStateAction<Partial<ReactSketchCanvasProps>>
  >;
}

function InputField({
  fieldName,
  type = "text",
  canvasProps,
  setCanvasProps,
}: InputFieldProps) {
  const handleChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setCanvasProps((prevCanvasProps: Partial<ReactSketchCanvasProps>) => ({
      ...prevCanvasProps,
      [fieldName]: target.value,
    }));
  };

  const id = `validation${fieldName}`;

  return (
    <div className="p-2 col-10">
      <label htmlFor={id} className="form-label">
        {fieldName}
      </label>
      <input
        name={fieldName}
        type={type}
        className="form-control"
        id={id}
        value={canvasProps[fieldName] as string}
        onChange={handleChange}
        min={1}
        max={30}
      />
    </div>
  );
}

function App() {
  const [canvasProps, setCanvasProps] = React.useState<
    Partial<ReactSketchCanvasProps>
  >({
    className: "react-sketch-canvas",
    width: "50%",
    height: "350px",
    // backgroundImage:
    //   "https://upload.wikimedia.org/wikipedia/commons/7/70/Graph_paper_scan_1600x1000_%286509259561%29.jpg",
    // preserveBackgroundImageAspectRatio: "none",
    strokeWidth: 4,
    eraserWidth: 5,
    strokeColor: "#000000",
    canvasColor: "#FFFFFF",
    style: { borderRight: "1px solid #CCC" },
    allowOnlyPointerType: "all",
  });

  const canvasRef = React.createRef<ReactSketchCanvasRef>();
  const [canvaslist, setcanvasList] = React.useState(['']);
  const [dataURI, setDataURI] = React.useState<string>("");
  const [svg, setSVG] = React.useState<string>("");
  const [paths, setPaths] = React.useState<CanvasPath[]>([]);
  const [lastStroke, setLastStroke] = React.useState<{
    stroke: CanvasPath | null;
    isEraser: boolean | null;
  }>({ stroke: null, isEraser: null });
  const [pathsToLoad, setPathsToLoad] = React.useState<string>("");
  const [sketchingTime, setSketchingTime] = React.useState<number>(0);
  const [exportImageType, setexportImageType] =
    React.useState<ExportImageType>("png");

  const imageExportHandler = async () => {
    const exportImage = canvasRef.current?.exportImage;

    if (exportImage) {
      const exportedDataURI = await exportImage(exportImageType);
      setDataURI(exportedDataURI);
      setcanvasList(current => [...current, ...[exportedDataURI]])
    }
  };

  const svgExportHandler = async () => {
    const exportSvg = canvasRef.current?.exportSvg;

    if (exportSvg) {
      const exportedDataURI = await exportSvg();
      setSVG(exportedDataURI);
    }
  };

  const getSketchingTimeHandler = async () => {
    const getSketchingTime = canvasRef.current?.getSketchingTime;

    try {
      if (getSketchingTime) {
        const currentSketchingTime = await getSketchingTime();
        setSketchingTime(currentSketchingTime);
      }
    } catch {
      setSketchingTime(0);
      console.error("With timestamp is disabled");
    }
  };

  const selectStrokeColor = (color : any) => {
    setCanvasProps(
      (prevCanvasProps: Partial<ReactSketchCanvasProps>) => ({
        ...prevCanvasProps,
        strokeColor: color,
      })
    );
  }
  const penHandler = () => {
    const eraseMode = canvasRef.current?.eraseMode;

    if (eraseMode) {
      eraseMode(false);
    }
  };

  const rectHandler =() => {
    
  }

  const eraserHandler = () => {
    const eraseMode = canvasRef.current?.eraseMode;

    if (eraseMode) {
      eraseMode(true);
    }
  };

  const undoHandler = () => {
    const undo = canvasRef.current?.undo;

    if (undo) {
      undo();
    }
  };

  const redoHandler = () => {
    const redo = canvasRef.current?.redo;

    if (redo) {
      redo();
    }
  };

  const clearHandler = () => {
    const clearCanvas = canvasRef.current?.clearCanvas;

    if (clearCanvas) {
      clearCanvas();
    }
  };

  const resetCanvasHandler = () => {
    const resetCanvas = canvasRef.current?.resetCanvas;

    if (resetCanvas) {
      resetCanvas();
    }
  };

  const createButton = (
    label: string,
    handler: () => void,
    themeColor: string
  ) => (
    <button
      key={label}
      className={`btn btn-${themeColor} btn-block`}
      type="button"
      onClick={handler}
    >
      {label}
    </button>
  );

  const buttonsWithHandlers: Handlers = [
    ["Rectangle", rectHandler, "primary"],
    ["Eraser", eraserHandler, "primary"],
    ["Undo", undoHandler, "primary"],
    ["Redo", redoHandler, "primary"],
    ["Clear", clearHandler, "primary"],
    ["Save", imageExportHandler, "primary"],
  ];

  const onChange = (updatedPaths: CanvasPath[]): void => {
    setPaths(updatedPaths);
  };

  return (
    <main>
      <div className="row">
        <section className="col-9">
          <header className="my-5">
            <h3>Sketch</h3>
          </header>
          <section className="row no-gutters canvas-area m-0 p-0">
          <div className="col-3 panel">
              <div className="d-grid gap-2">
                {buttonsWithHandlers.map(([label, handler, themeColor]) =>
                  createButton(label, handler, themeColor)
                )}
              </div>
            </div>
            <div className="col-9 canvas p-0">
              <ReactSketchCanvas
                ref={canvasRef}
                onChange={onChange}
                onStroke={(stroke, isEraser) =>
                  setLastStroke({ stroke, isEraser })
                }
                {...canvasProps}
              />
            </div>
          </section>
        </section>      
        <div className="color-picker ">
          <button className="active color_1" onClick={() => selectStrokeColor("#000")}>
          </button>
          <button className="color_2" onClick={() => selectStrokeColor("red")}>
          </button>
          <button className="color_3" onClick={() => selectStrokeColor("#01fefc")}>
          </button>
          <button className="color_4" onClick={() => selectStrokeColor("#0001fc")}>
          </button>
          <button className="color_5" onClick={() => selectStrokeColor("#0100a7")}>
          </button>
          <button className="color_6" onClick={() => selectStrokeColor("#acd8e5")}>
          </button>
          <button className="color_7" onClick={() => selectStrokeColor("#81007f")}>
          </button>
          <button className="color_8" onClick={() => selectStrokeColor("#ffff04")}>
          </button>
          <button className="color_9" onClick={() => selectStrokeColor("#05fd00")}>
          </button>
          <button className="color_10" onClick={() => selectStrokeColor("#ff00fe")} >
          </button>
          { canvaslist.length == 0 ? '' : canvaslist.map((path, index) => {
        return (
          path == '' ? '':
          <div key={index}>
           <img
                className="exported-image"
                id="exported-image"
                src={
                  path 
                }
                alt="exported"
              />
          </div>
        );
      })}

        </div> 
      </div>

      {/* //----------------- */}

    {/*    <section className="col-9">
        <section className="row image-export p-3 justify-content-center align-items-start">
            <div className="col-5 row form-group">
              <label className="col-12" htmlFor="imageDataURI">
                Exported Data URI for imagetype
              </label>
              <textarea
                id="imageDataURI"
                className="dataURICode col-12"
                readOnly
                rows={10}
                value={dataURI || "Click on export image"}
              />
            </div>
            <div className="col-5 offset-2">
              <p>Exported image</p>
              <img
                className="exported-image"
                id="exported-image"
                src={
                  dataURI ||
                  "https://via.placeholder.com/500x250/000000/FFFFFF/?text=Click on export image"
                }
                alt="exported"
              />
            </div>
          </section>

           <section className="row image-export p-3 justify-content-center align-items-start">
            <div className="col-5 row form-group">
              <label className="col-12" htmlFor="svgCode">
                Exported SVG code
              </label>
              <textarea
                id="svgCode"
                className="dataURICode col-12"
                readOnly
                rows={10}
                value={svg || "Click on export svg"}
              />
            </div>
            <div className="col-5 offset-2">
              <p>Exported SVG</p>
              {svg ? (
                <span
                  id="exported-svg"
                  className="exported-image"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              ) : (
                <img
                  src="https://via.placeholder.com/500x250/000000/FFFFFF/?text=Click on export SVG"
                  alt="Svg Export"
                  id="exported-svg"
                  className="exported-image"
                />
              )}
            </div>
          </section> 
        </section>*/}
        
    </main>
  );
}

export default App;