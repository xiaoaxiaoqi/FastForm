<script setup>
import {onMounted, ref} from "vue";
import {apiGetObjectInfo, apiHistory, apiPrompt} from "@/utils/api.js";
import {v4 as uuid} from "uuid";
import {ElMessage} from "element-plus";
const init = ref(false)
const form = ref({"3":{"inputs":{"seed":277042712147383,"steps":20,"cfg":8,"sampler_name":"euler","scheduler":"normal","denoise":1,"model":["4",0],"positive":["6",0],"negative":["7",0],"latent_image":["5",0]},"class_type":"KSampler","_meta":{"title":"K采样器"}},"4":{"inputs":{"ckpt_name":"3D角色IP 迪士尼风格_v2.0.safetensors"},"class_type":"CheckpointLoaderSimple","_meta":{"title":"Checkpoint加载器(简易)"}},"5":{"inputs":{"width":512,"height":512,"batch_size":1},"class_type":"EmptyLatentImage","_meta":{"title":"空Latent"}},"6":{"inputs":{"text":"beautiful scenery nature glass bottle landscape, , purple galaxy bottle,","clip":["4",1]},"class_type":"CLIPTextEncode","_meta":{"title":"CLIP文本编码器"}},"7":{"inputs":{"text":"text, watermark","clip":["4",1]},"class_type":"CLIPTextEncode","_meta":{"title":"CLIP文本编码器"}},"8":{"inputs":{"samples":["3",0],"vae":["4",2]},"class_type":"VAEDecode","_meta":{"title":"VAE解码"}},"9":{"inputs":{"filename_prefix":"ComfyUI","images":["8",0]},"class_type":"SaveImage","_meta":{"title":"保存图像"}}});
const labelPosition = ref('top');
const objectInfoList = ref([])
const imageSrc = ref('')
const prompt_id = ref('')

const handlePrompt = async () => {
    prompt_id.value = ''
  imageSrc.value = ''
  try {
    const data = {
      client_id: uuid(),
      prompt: form.value
    }
    const result = await apiPrompt(data)
    if (result && result.prompt_id) {
      prompt_id.value = result.prompt_id
      ElMessage({message: '提交成功', type: 'success'})
      await history()
    } else {
      ElMessage({message: '提交失败', type: 'error'})
    }
  } catch (error) {
    console.error('请求出错:', error);
  }
}
const history = async () => {
  const intervalId = setInterval(async () => {
    try {
      const response = await apiHistory(prompt_id.value)
      if (Object.keys(response).length !== 0) {
        clearInterval(intervalId)
        imageSrc.value = response[prompt_id.value]['outputs']['9']['images'][0]['filename']
        console.log(imageSrc.value)
      }
    } catch (error) {
      console.error('请求出错:', error);
    }
  }, 1000); // 每隔2秒执行一次
}
onMounted(async ()=>{
  try {
    objectInfoList.value = await apiGetObjectInfo()
    init.value = true
  } catch (error) {
    console.error('请求出错:', error);
  }
})
</script>

<template>
<el-row>
<el-col :span="10">
 <el-form
    :label-position="labelPosition"
      label-width="auto"
      :model="form"
      style="max-width: 600px"
      v-if="init"
  >
  <el-form-item label="随机种子">
      <el-input type="number" v-model="form['3'].inputs.seed" />
    </el-form-item><el-form-item label="步数">
      <el-input type="number" v-model="form['3'].inputs.steps" />
    </el-form-item><el-form-item label="CFG">
      <el-input type="number" v-model="form['3'].inputs.cfg" />
    </el-form-item><el-form-item label="采样器"><el-select placeholder="采样器" v-model="form['3'].inputs.sampler_name">
        <el-option :label="item" :value="item" v-for="item in objectInfoList['KSampler']['input']['required']['sampler_name'][0]"/>
      </el-select></el-form-item><el-form-item label="调度器"><el-select placeholder="调度器" v-model="form['3'].inputs.scheduler">
        <el-option :label="item" :value="item" v-for="item in objectInfoList['KSampler']['input']['required']['scheduler'][0]"/>
      </el-select></el-form-item><el-form-item label="降噪">
      <el-input type="number" v-model="form['3'].inputs.denoise" />
    </el-form-item>
<el-form-item label="模型名称"><el-select placeholder="模型名称" v-model="form['4'].inputs.ckpt_name">
        <el-option :label="item" :value="item" v-for="item in objectInfoList['CheckpointLoaderSimple']['input']['required']['ckpt_name'][0]"/>
      </el-select></el-form-item>
<el-form-item label="宽度">
      <el-input type="number" v-model="form['5'].inputs.width" />
    </el-form-item><el-form-item label="高度">
      <el-input type="number" v-model="form['5'].inputs.height" />
    </el-form-item><el-form-item label="批次大小">
      <el-input type="number" v-model="form['5'].inputs.batch_size" />
    </el-form-item>
<el-form-item label="text">
      <el-input type="text" v-model="form['6'].inputs.text" />
    </el-form-item>
<el-form-item label="text">
      <el-input type="text" v-model="form['7'].inputs.text" />
    </el-form-item>

<el-form-item label="文件名缀">
      <el-input type="text" v-model="form['9'].inputs.filename_prefix" />
    </el-form-item>

   </el-form>
   </el-col>
   <el-col :span="14">
      <div style="display: flex;flex-direction: column;align-items: center">
        <el-button type="primary" size="large" @click="handlePrompt">开始生成</el-button>
        <el-image fit="cover" :src="'http://127.0.0.1:8188/view?filename='+imageSrc" v-if="imageSrc"></el-image>
      </div>
    </el-col>
   </el-row>
</template>
<style scoped>

</style>
