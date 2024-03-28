const lang = {
    "seed": "随机种子",
    "steps": "步数",
    "cfg": "CFG",
    "sampler_name": "采样器",
    "scheduler": "调度器",
    "denoise": "降噪",
    "ckpt_name": "模型名称",
    "width": "宽度",
    "height": "高度",
    "batch_size": "批次大小",
    "filename_prefix": "文件名缀",
}

export const __ = (key) => {
    return lang[key] || key;
}