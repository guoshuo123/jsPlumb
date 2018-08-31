jQuery(function ($) {
$(function() {
    jsPlumbToolkit.ready(function () {

        // ------------------------ toolkit setup ------------------------------------

        // This function is what the toolkit will use to get an ID from a node.
        var idFunction = function (n) {
            return n.id;
        };

        // This function is what the toolkit will use to get the associated type from a node.
        var typeFunction = function (n) {
            return n.type;
        };

        var saveError = function(msg) {
            alert(msg) 
        };

        // get the various dom elements
        var mainElement = document.querySelector("#jtk-demo-flowchart"),
            canvasElement = mainElement.querySelector(".jtk-demo-canvas"),
            miniviewElement = mainElement.querySelector(".miniview"),
            nodePalette = mainElement.querySelector(".node-palette"),
            controls = mainElement.querySelector(".controls");

        // Declare an instance of the Toolkit, and supply the functions we will use to get ids and types from nodes.
        var toolkit = jsPlumbToolkit.newInstance({
            idFunction: idFunction,
            typeFunction: typeFunction,
            nodeFactory: function (type, data, callback) {

                if (type == 'question') {
                    jsPlumbToolkit.Dialogs.show({
                        id: "position_dlgText",
                        title: "新增条件",
                        onOK: function (d) {
                            data.text = d.text;
                            if (data.text) {
                                if (data.text.length >= 2) {
                                    // set an id and continue.
                                    data.id = jsPlumbToolkitUtil.uuid();
                                    data.position_key = d.position_key;
                                    callback(data);
                                } else {
                                    // else advise the user.
                                    alert(type + " 长度必须大于2个字符!");
                                }
                            }
                        }
                    });
                } else if (type == 'action') {
                    jsPlumbToolkit.Dialogs.show({
                        id: "dlgText",
                        title: "新增步骤",
                        onOK: function (d) {
                            data.text = d.text;
                            if (data.text) {
                                if (data.text.length >= 2) {
                                    // set an id and continue.
                                    data.id = jsPlumbToolkitUtil.uuid();
                                    data.permissions_type = d.permissions_type;
                                    data.permissions_eid = d.permissions_eid;
                                    data.permissions_zu_one = d.permissions_zu_one;
                                    data.permissions_zu_all = d.permissions_zu_all;
                                    data.permissions_zu_ment = d.permissions_zu_ment;
                                    data.permissions_zd_ment = d.permissions_zd_ment;
                                    if (data.permissions_type && (data.permissions_eid 
                                        || data.permissions_zu_one || data.permissions_zu_all
                                        || data.permissions_zu_ment != 0 || data.permissions_zd_ment != 0)) {

                                        callback(data);
                                    } else {
                                        alert("请选择审核权限!");
                                    }
                                } else {
                                    // else advise the user.
                                    alert(type + " 长度必须大于2个字符!");
                                }
                            }
                        }
                    });
                } else if (type == 'output') {
                    jsPlumbToolkit.Dialogs.show({
                        id: "output_dlgText",
                        title: "新增终点",
                        onOK: function (d) {
                            data.text = d.text;
                            if (data.text) {
                                if (data.text.length >= 2) {

                                    // set an id and continue.
                                    data.id = jsPlumbToolkitUtil.uuid();
                                    callback(data);
                                } else {
                                    // else advise the user.
                                    alert(type + " 长度必须大于2个字符!");
                                }
                            }
                        }
                    });
                }
            },
            beforeStartConnect:function(node, edgeType) {
                // limit edges from start node to 1. if any other type of node, return
                return (node.data.type === "start" && node.getEdges().length > 0) ? false : { label:" " };
            },
            autoSave:false,
            onAutoSaveError: saveError,
        });

        // ------------------------ / toolkit setup ------------------------------------

        // ------------------------- dialogs -------------------------------------

        jsPlumbToolkit.Dialogs.initialize({
            selector: ".dlg"
        });

        // ------------------------- / dialogs ----------------------------------

        // ------------------------ rendering ------------------------------------

        var _editLabel = function(edge, deleteOnCancel) {
            if (edge.source.data.type != 'start') {
                jsPlumbToolkit.Dialogs.show({
                    id: "judge_dlgText",
                    data: {
                        text: edge.data.label || "",
                        conditions: edge.data.conditions,
                        conditions_val: edge.data.conditions_val,
                        position_form: edge.data.position_form,
                        position_key: edge.data.position_key,
                        question_link: edge.data.question_link
                    },
                    onOK: function (data) {
                        console.log(data);
                        toolkit.updateEdge(edge, { 
                            label: data.text || "",
                            conditions: data.conditions,
                            conditions_val: data.conditions_val,
                            position_form: data.position_form,
                            position_key: data.position_key,
                            question_link: data.question_link
                        });
                    },
                    onCancel:function() {
                        if (deleteOnCancel) {
                            toolkit.removeEdge(edge);
                        }
                    }
                });
            } else {
                toolkit.updateEdge(edge, {label: " "});
            }
        };

        // Instruct the toolkit to render to the 'canvas' element. We pass in a view of nodes, edges and ports, which
        // together define the look and feel and behaviour of this renderer.  Note that we can have 0 - N renderers
        // assigned to one instance of the Toolkit..
        var renderer = window.renderer = toolkit.render({
            container: canvasElement,
            view: {
                nodes: {
                    "start": {
                        template: "tmplStart"
                    },
                    "selectable": {
                        events: {
                            tap: function (params) {
                                toolkit.toggleSelection(params.node);
                            }
                        }
                    },
                    "question": {
                        parent: "selectable",
                        template: "tmplQuestion",
                    },
                    "action": {
                        parent: "selectable",
                        template: "tmplAction",
                    },
                    "output":{
                        parent:"selectable",
                        template:"tmplOutput",
                    }
                },
                // There are two edge types defined - 'yes' and 'no', sharing a common
                // parent.
                edges: {
                    "default": {
                        anchor:"AutoDefault",
                        endpoint:"Blank",
                        connector: ["Flowchart", { cornerRadius: 5 } ],
                        paintStyle: { lineWidth: 2, strokeStyle: "#f76258", outlineWidth: 3, outlineStroke: "transparent" },   //  paint style for this edge type.
                        hoverPaintStyle: { strokeWidth: 2, stroke: "rgb(67,67,67)" }, // hover paint style for this edge type.
                        events: {
                            "dblclick": function (params) {
                                jsPlumbToolkit.Dialogs.show({
                                    id: "dlgConfirm",
                                    data: {
                                        msg: "确定删除关联"
                                    },
                                    onOK: function () {
                                        // console.log(params.edge.source.data);
                                        // if (params.edge.source.data.type == 'question' ) {
                                        //     $.ajax({
                                        //         url: '/approve/flow/del-question',
                                        //         data: {
                                        //             source_id: params.edge.source.data.id,
                                        //             target_id: params.edge.target.data.id,
                                        //             mark: '5c73ee5afze5qu58',
                                        //         },
                                        //         type: 'POST',
                                        //         dataType: 'json',
                                        //         success: function(resp) {
                                        //             toolkit.removeEdge(params.edge);
                                        //         },
                                        //         error: function() {
                                        //         }
                                        //     });
                                        // }
                                        toolkit.removeEdge(params.edge);
                                    }
                                });
                            }
                        },
                        overlays: [
                            [ "Arrow", { location: 1, width: 10, length: 10 }],
                            [ "Arrow", { location: 0.3, width: 10, length: 10 }]
                        ]
                    },
                    "connection":{
                        parent:"default",
                        overlays:[
                            [
                                "Label", {
                                    label: "${label}",
                                    events:{
                                        click:function(params) {
                                            _editLabel(params.edge);
                                        }
                                    }
                                }
                            ]
                        ]
                    }
                },

                ports: {
                    "start": {
                        edgeType: "default"
                    },
                    "source": {
                        maxConnections: -1,
                        edgeType: "connection"
                    },
                    "target": {
                        maxConnections: -1,
                        isTarget: true,
                        dropOptions: {
                            hoverClass: "connection-drop"
                        }
                    }
                }
            },
            // Layout the nodes using an absolute layout
            layout: {
                type: "Absolute"
            },
            events: {
                canvasClick: function (e) {
                    toolkit.clearSelection();
                },
                edgeAdded:function(params) {
                    // console.log(params);
                    if (params.addedByMouse) {
                        _editLabel(params.edge, true);
                    }
                },
                nodeDropped:function(info) {
                    console.log("node ", info.source.id, "dropped on ", info.target.id);
                }
            },
            miniview: {
                container: miniviewElement
            },
            lassoInvert:true,
            elementsDroppable:true,
            consumeRightClick: false,
            dragOptions: {
                filter: ".jtk-draw-handle, .node-action, .node-action i",
                magnetize:true
            }
        });

    
        var datasetView = new jsPlumbSyntaxHighlighter(toolkit, ".jtk-demo-dataset");

        // Load the data.
        // Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https.
        toolkit.load({
            url: "./data.json",
        });

        // listener for mode change on renderer.
        renderer.bind("modeChanged", function (mode) {
            jsPlumb.removeClass(controls.querySelectorAll("[mode]"), "selected-mode");
            jsPlumb.addClass(controls.querySelectorAll("[mode='" + mode + "']"), "selected-mode");
        });

        // pan mode/select mode
        jsPlumb.on(controls, "tap", "[mode]", function () {
            renderer.setMode(this.getAttribute("mode"));
        });

        // on home button click, zoom content to fit.
        jsPlumb.on(controls, "tap", "[reset]", function () {
            toolkit.clearSelection();
            renderer.zoomToFit();
        });

        // configure Drawing tools.
        new jsPlumbToolkit.DrawingTools({
            renderer: renderer
        });

        jsPlumb.on(canvasElement, "tap", ".node-delete i", function () {
            var info = renderer.getObjectInfo(this);
            if (info.obj.data.id == 'start') {
                return false;
            }
            jsPlumbToolkit.Dialogs.show({
                id: "dlgConfirm",
                data: {
                    msg: "删除 '" + info.obj.data.text + "'"
                },
                onOK: function () {
                    // console.log(info.obj.data.id);
                    toolkit.removeNode(info.obj);
                    // $.ajax({
                    //     url: '/approve/flow/del-node',
                    //     data: {
                    //         source_id: info.obj.data.id,
                    //         mark: '5c73ee5afze5qu58',
                    //     },
                    //     type: 'POST',
                    //     dataType: 'json',
                    //     success: function(resp) {
                    //         if (resp.code == 0 || resp.code == '1001') {
                    //             alert('删除成功');
                    //             toolkit.removeNode(info.obj);
                    //             return true;
                    //         }

                    //         alert(resp.msg);
                    //     },
                    //     error: function() {
                    //     }
                    // });
                }
            });
        });

        // change a question or action's label
        jsPlumb.on(canvasElement, "tap", ".node-edit i", function () {
            // getObjectInfo is a method that takes some DOM element (this function's `this` is
            // set to the element that fired the event) and returns the toolkit data object that
            // relates to the element. it ascends through parent nodes until it finds a node that is
            // registered with the toolkit.
            var info = renderer.getObjectInfo(this);
            if (info.obj.data.id == 'start') {
                return false;
            }
            if (info.obj.data.type == 'question') {
                var title = '条件';
                jsPlumbToolkit.Dialogs.show({
                    id: "position_dlgText",
                    data: info.obj.data,
                    title: "编辑" + title,
                    onOK: function (data) {

                        if (data.text) {
                            // if name is at least 2 chars long, update the underlying data and
                            // update the UI.
                            toolkit.updateNode(info.obj, data);
                        }
                    }
                });

            } else if (info.obj.data.type == 'output') {
                var title = '终点';
                jsPlumbToolkit.Dialogs.show({
                    id: "output_dlgText",
                    data: info.obj.data,
                    title: "编辑" + title,
                    onOK: function (data) {
                        if (data.text && data.text.length > 2) {
                            // if name is at least 2 chars long, update the underlying data and
                            // update the UI.
                            toolkit.updateNode(info.obj, data);
                        }
                    }
                });

            } else if (info.obj.data.type == 'action') {
                var title = '步骤';
                jsPlumbToolkit.Dialogs.show({
                    id: "dlgText",
                    data: info.obj.data,
                    title: "编辑" + title,
                    onOK: function (data) {
                        if (data.text && data.text.length > 2) {
                            // if name is at least 2 chars long, update the underlying data and
                            // update the UI.
                            toolkit.updateNode(info.obj, data);
                        }
                    }
                });
            }
        });

        // ------------------------ / rendering ------------------------------------


        // ------------------------ drag and drop new tables/views -----------------

        //
        // Here, we are registering elements that we will want to drop onto the workspace and have
        // the toolkit recognise them as new nodes.
        //
        //  typeExtractor: this function takes an element and returns to jsPlumb the type of node represented by
        //                 that element. In this application, that information is stored in the 'jtk-node-type' attribute.
        //
        //  dataGenerator: this function takes a node type and returns some default data for that node type.
        //
        renderer.registerDroppableNodes({
            droppables: nodePalette.querySelectorAll("li"),
            dragOptions: {
                zIndex: 50000,
                cursor: "move",
                clone: true
            },
            typeExtractor: function (el) {
                return el.getAttribute("jtk-node-type");
            },
            dataGenerator: function (type) {
                return {
                    w:140,
                    h:100,
                };
            }
        });

        // ------------------------ / drag and drop new tables/views -----------------

    });
})
$(function() {
    $(".left_nav li .t").click(function() {

        if ($(this).find('i').length) {
            $(this).toggleClass("hover");

            $(this).parent().siblings().find(".t").removeClass('hover');
            $(this).next(".txt").slideToggle();
        } else {
            $(this).toggleClass("hover");
            $(this).siblings().parent().find(".t").removeClass('hover');
        }
    });
    $(".txt p").click(function() {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');

    })
    
    $(".more").on('click', function() {

    })
});


});