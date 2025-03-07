type AssertExtends<A,B> = A extends B ? true : never;

import * as joint from '../../build/joint';

const graph = new joint.dia.Graph({ graphAttribute: true });

const rectangle = new joint.shapes.standard.Rectangle({
    attrs: {
        body: {
            fill: {
                type: 'pattern',
                markup: [{
                    tagName: 'circle',
                    attributes: {
                        r: 5
                    }
                }]
            },
            stroke: {
                type: 'linearGradient',
                stops: [{ offset: 0.5, color: 'red' }]
            },
            filter: {
                id: 'test-filter',
                name: 'dropShadow',
                args: {
                    dx: 5,
                    dy: 5,
                    blur: 5
                }
            }
        }
    }
});

const link = new joint.shapes.standard.Link({
    attrs: {
        line: {
            sourceMarker: {
                markup: '<circle cx="0" cy="0" r="5"/>',
                attrs: {
                    fill: 'red'
                }
            },
            targetMarker: {
                type: 'path',
                d: 'M 10 10 20 20'
            }
        }
    }
});

graph.addCells([
    rectangle,
    new joint.shapes.standard.Circle(),
    new joint.shapes.standard.Ellipse(),
    new joint.shapes.standard.Path(),
    new joint.shapes.standard.Polygon(),
    new joint.shapes.standard.Polyline(),
    new joint.shapes.standard.Image(),
    new joint.shapes.standard.BorderedImage(),
    new joint.shapes.standard.EmbeddedImage(),
    new joint.shapes.standard.InscribedImage(),
    new joint.shapes.standard.HeaderedRectangle(),
    new joint.shapes.standard.Circle(),
    new joint.shapes.standard.Ellipse(),
    link,
    new joint.shapes.standard.DoubleLink(),
    new joint.shapes.standard.ShadowLink(),
    {
        id: 'test-id-1',
        type: 'standard.Rectangle'
    }
]);

graph.addCell({
    id: 'test-id-2',
    type: 'standard.Ellipse',
    attrs: {
        body: {
            fill: 'red'
        }
    }
});

// `cells` attribute is a collection of cells
const cell = graph.get('cells').at(0);
(<joint.dia.Element>cell).getBBox({ rotate: true }).inflate(5);

// ModelSetOptions
graph.set('test', true, { dry: true });
rectangle.set('test', true, { silent: true, customOption: true });

// a child inherits attributes from `dia.Element`
const cylinder = new joint.shapes.standard.Cylinder({ z: 0 });
cylinder.set({ position: { x: 4, y: 5 }});
cylinder.set('z', cylinder.attributes.z + 1);

const paper = new joint.dia.Paper({
    model: graph,
    frozen: true,
    findParentBy: (_elementView, _evt, x, y) => graph.findModelsFromPoint({ x, y })
});

const cellView = cell.findView(paper);
cellView.vel.addClass('test-class');

let isHTMLView: AssertExtends<typeof paper.vel, null> = true;
let isSVGView: AssertExtends<typeof cellView.vel, joint.Vectorizer> = true;

const { size, position } = rectangle.toJSON();
let isTypeofSize: AssertExtends<typeof size, joint.dia.Size> = true;
let isTypeofPoint: AssertExtends<typeof position, joint.dia.Point> = true;

const layer = new joint.dia.PaperLayer();
layer.insertNode(cellView.el);
layer.insertSortedNode(cellView.el, 5);

// paper events
paper.on('link:pointerclick', function(linkView, evt) {
    evt.stopPropagation();
    linkView.model.vertices([]);
});

paper.on('element:pointerdblclick', function(elementView) {
    elementView.model.addPort({});
});

paper.on({
    'render:done': function(stats) {
        if (stats.priority > 2) {
            paper.on('custom-event', function(paper: joint.dia.Paper) {
                paper.off('custom-event');
            });
        }
    }
});

cellView.listenTo(paper, {
    'cell:highlight': function(cellView, node, opt) {
        let isHighlightingOptions: AssertExtends<typeof opt, joint.dia.CellView.EventHighlightOptions> = true;
        let isSVGElement: AssertExtends<typeof node, SVGElement> = true;
        if (opt.type === joint.dia.CellView.Highlighting.DEFAULT) {
            cellView.el.classList.add('highlighted');
        }
    }
} as joint.dia.Paper.EventMap);
