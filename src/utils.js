const getEntites = bucket => bucket.entities || [];

export const findFirstBucketWithEntity = (steps, fromStep, entity) => {
    for (let stepIndex = fromStep; stepIndex < steps.length; stepIndex += 1) {
        const step = steps[stepIndex];
        const bucketIndex = step.buckets.findIndex(b => getEntites(b).find(e => e.id === entity.id));
        if (bucketIndex !== -1) {
            const bucket = step.buckets[bucketIndex];
            return {
                step: step.id, stepIndex, bucket: bucket.id, bucketIndex
            };
        }
    }
    return undefined;
};

export const buildFlows = steps => steps.reduce((flows, step, stepIndex) => {
    if (stepIndex >= steps.length - 1) {
        return flows;
    }
    return [
        ...flows,
        ...step.buckets.reduce((stepFlows, bucket, bucketIndex) => [
            ...stepFlows,
            ...(getEntites(bucket).reduce((bucketFlows, entity) => {
                const firstTargetBucket = findFirstBucketWithEntity(steps, stepIndex + 1, entity);
                if (!firstTargetBucket) {
                    return bucketFlows;
                }
                const bucketFlow = bucketFlows.find(({ target }) => target.step === firstTargetBucket.step && target.bucket === firstTargetBucket.bucket);
                if (bucketFlow) {
                    bucketFlow.entities = [...bucketFlow.entities, entity];
                    return bucketFlows;
                }
                return [
                    ...bucketFlows,
                    {
                        source: {
                            stepIndex,
                            bucketIndex,
                            step: step.id,
                            bucket: bucket.id
                        },
                        target: {
                            stepIndex: firstTargetBucket.stepIndex,
                            bucketIndex: firstTargetBucket.bucketIndex,
                            step: firstTargetBucket.step,
                            bucket: firstTargetBucket.bucket
                        },
                        entities: [entity]
                    }
                ];
            }, []))
        ], [])
    ];
}, []);

const isInBucket = (entity, bucketId) => entity.buckets && entity.buckets[bucketId];

export const assignToBuckets = (entities, steps) => {
    const entitiesToDrop = entities.filter(entity => isInBucket(entity, 'drop')).map(entity => entity.id);
    return steps.reduceRight((acc, step) => ([
        {
            ...step,
            buckets: step.buckets.map((bucket, index) => ({
                ...bucket,
                entities: entities.filter((entity) => {
                    if (isInBucket(entity, bucket.id)) {
                        if (step.buckets.some((b, i) => i > index && isInBucket(entity, b.id))) {
                            console.warn(`Entity ${entity.id} is present in multiple buckets in the same step`);
                        }
                        return true;
                    }
                    return false;
                }),
                drop: entities.filter((entity) => {
                    if (entitiesToDrop.includes(entity.id) && isInBucket(entity, bucket.id)) {
                        const dropIndex = entitiesToDrop.findIndex(e => e.id === entity.id);
                        entitiesToDrop.splice(dropIndex, 1);
                        return true;
                    }
                    return false;
                })
            }))
        },
        ...acc]), []);
};
