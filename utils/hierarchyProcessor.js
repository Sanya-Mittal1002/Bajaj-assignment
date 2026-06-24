function processHierarchy(data) {
    const invalidEntries = [];
    const duplicateEdges = [];
    const edgeSet = new Set();
    const duplicateSet = new Set();
    const childParent = {};
    const graph = {};
    const regex = /^[A-Z]->[A-Z]$/;
    for (let entry of data) {
        entry = entry.trim();
        if (!regex.test(entry)) {
            invalidEntries.push(entry);
            continue;
        }
        const [parent, child] = entry.split("->");
        if (parent === child) {
            invalidEntries.push(entry);
            continue;
        }
        if (edgeSet.has(entry)) {

            if (!duplicateSet.has(entry)) {
                duplicateEdges.push(entry);
                duplicateSet.add(entry);
            }

            continue;
        }

        edgeSet.add(entry);
        if (childParent[child]) {
            continue;
        }
        childParent[child] = parent;
        if (!graph[parent]) graph[parent] = [];
        if (!graph[child]) graph[child] = [];

        graph[parent].push(child);
    }
    const nodes = new Set();

    Object.keys(graph).forEach(node => {
        nodes.add(node);

        graph[node].forEach(child => {
            nodes.add(child);
        });
    });

    const undirected = {};

    nodes.forEach(node => {
        undirected[node] = [];
    });

    for (const parent in graph) {
        for (const child of graph[parent]) {
            undirected[parent].push(child);
            undirected[child].push(parent);
        }
    }

    const visited = new Set();
    const components = [];

    for (const node of nodes) {

        if (visited.has(node)) continue;

        const stack = [node];
        const component = [];

        visited.add(node);

        while (stack.length) {

            const current = stack.pop();

            component.push(current);

            for (const next of undirected[current]) {

                if (!visited.has(next)) {

                    visited.add(next);
                    stack.push(next);
                }
            }
        }

        components.push(component);
    }

    function detectCycle(node, visiting, visitedCycle, componentSet) {

        visiting.add(node);

        for (const child of graph[node] || []) {

            if (!componentSet.has(child)) continue;

            if (visiting.has(child)) {
                return true;
            }

            if (!visitedCycle.has(child)) {

                if (
                    detectCycle(
                        child,
                        visiting,
                        visitedCycle,
                        componentSet
                    )
                ) {
                    return true;
                }
            }
        }

        visiting.delete(node);
        visitedCycle.add(node);

        return false;
    }

    function buildTree(node) {

        const result = {};

        for (const child of graph[node] || []) {
            result[child] = buildTree(child);
        }

        return result;
    }

    function getDepth(node) {

        if (
            !graph[node] ||
            graph[node].length === 0
        ) {
            return 1;
        }

        let maxDepth = 0;

        for (const child of graph[node]) {
            maxDepth = Math.max(
                maxDepth,
                getDepth(child)
            );
        }

        return maxDepth + 1;
    }

    const hierarchies = [];

    let totalTrees = 0;
    let totalCycles = 0;

    let largestDepth = 0;
    let largestRoot = "";

    for (const component of components) {

        const componentSet = new Set(component);

        const roots = component.filter(
            node => !childParent[node]
        );

        let root;

        if (roots.length > 0) {

            roots.sort();
            root = roots[0];

        } else {

            root = [...component].sort()[0];
        }

        const visiting = new Set();
        const visitedCycle = new Set();

        const cycleExists = detectCycle(
            root,
            visiting,
            visitedCycle,
            componentSet
        );

        if (cycleExists) {

            totalCycles++;

            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });

        } else {

            totalTrees++;

            const treeObj = {};
            treeObj[root] = buildTree(root);

            const depth = getDepth(root);

            hierarchies.push({
                root,
                tree: treeObj,
                depth
            });

            if (
                depth > largestDepth ||
                (
                    depth === largestDepth &&
                    (
                        largestRoot === "" ||
                        root < largestRoot
                    )
                )
            ) {
                largestDepth = depth;
                largestRoot = root;
            }
        }
    }

    return {

        user_id: "sanyamittal_10022005",
        email_id: "sanya1042.be23@chitkara.edu.in",
        college_roll_number: "2310991042",
        hierarchies,
        invalid_entries: invalidEntries,
        duplicate_edges: duplicateEdges,
        summary: {
            total_trees: totalTrees,
            total_cycles: totalCycles,
            largest_tree_root: largestRoot
        }
    };
}
module.exports = processHierarchy;