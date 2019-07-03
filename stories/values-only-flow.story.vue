<template>
    <div style="height: 600px">
        <BucketFlowGraph :data="data" />
    </div>
</template>

<script>
    import BucketFlowGraph from '../src/BucketFlowGraph';

    const generateEntities = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => ({ id: i + from, title: `${i + from}` }));

    export default {
        components: {
            BucketFlowGraph
        },
        data() {
            return {
                data: {
                    steps: [
                        {
                            title: 'Step A',
                            scale: 0.1,
                            buckets: [
                                {
                                    title: 'Bucket 1',
                                    entities: generateEntities(1, 300),
                                    color: '#6554c0'
                                },
                                {
                                    title: 'Bucket 2',
                                    entities: generateEntities(301, 500),
                                    color: '#6554c0'
                                },
                                {
                                    title: 'Bucket 3',
                                    entities: generateEntities(501, 600),
                                    color: '#6554c0'
                                }
                            ]
                        },
                        {
                            title: 'Step B',
                            buckets: [
                                {
                                    title: 'Bucket 1',
                                    color: '#00b8d9',
                                    entities: [
                                        ...generateEntities(1, 4),
                                        ...generateEntities(301, 305)
                                    ]
                                },
                                {
                                    title: 'Bucket 2',
                                    color: '#00b8d9',
                                    entities: [
                                        ...generateEntities(5, 20),
                                        ...generateEntities(306, 310),
                                        ...generateEntities(501, 505)
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Step C',
                            buckets: [
                                {
                                    title: 'Bucket 1',
                                    color: '#ffab00',
                                    entities: [
                                        ...generateEntities(1, 4),
                                        ...generateEntities(5, 10),
                                        ...generateEntities(506, 510)
                                    ]
                                }
                            ]
                        }
                    ]
                }
            };
        }
    };
</script>
