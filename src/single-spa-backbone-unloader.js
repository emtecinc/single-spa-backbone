
export default function unloadBackboneApp() {
    return new Promise((resolve, reject) => {
        try {
            if (Backbone.History.started)
                Backbone.history.stop();
            resolve();
        }
        catch (err) {
            reject(err);
        }
    });
}