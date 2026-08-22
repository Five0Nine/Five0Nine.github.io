(function () {
  'use strict';

  const root = document.querySelector('[data-network-journey]');
  if (!root) return;

  const stages = [
    {
      kicker: 'STEP 01 · 按需完成接入准备',
      title: '确认主机已有网络参数',
      progressTitle: '网络参数：已有则直接使用，首次接入时运行 DHCP',
      layer: 'application',
      layerBadge: '应用层 · 跨层过程',
      packet: 'DHCP 报文',
      position: '2%',
      path: '12%',
      motion: 'broadcast',
      devices: ['client', 'switch', 'dhcp', 'peer'],
      summary: '浏览器访问网页以前，主机必须已有 IP、子网掩码、默认网关和 DNS 地址；只有刚接入或租约失效时才需要运行 DHCP。',
      state: ['DHCP 应用报文', 'IP 广播 + MAC 广播', '用户主机、DHCP 服务器', '超时后重新尝试 DHCP'],
      event: [
        '先检查主机是否已经保存可用的网络参数；已有配置时直接进入下一步。',
        '若尚无配置，客户端广播 <strong>DHCP Discover</strong> 寻找服务器。',
        '服务器与客户端依次完成 Offer、Request 和 ACK。',
        '主机最终得到本机 IP、子网掩码、默认网关和 DNS 服务器地址。'
      ],
      packetChange: [
        '初始源 IP 可以是 <code>0.0.0.0</code>，目的 IP 使用受限广播地址。',
        '客户端还不知道本地网络中的具体接收者，因此链路层也使用广播。',
        'DHCP 是应用层协议，但报文仍要经过 UDP、IP 和链路层封装。'
      ],
      exam: [
        '“主机没有 IP 就完全不能发送 IP 分组”是错误说法，DHCP 为这个启动场景规定了特殊地址。',
        'DORA 四步要与租期更新过程区分，主流程不在这里展开续租。',
        'DHCP 分配的不只是 IP 地址，还常包括掩码、默认网关与 DNS 地址。'
      ],
      question: '为什么主机还没有 IP 地址，也能发出 DHCP Discover？',
      answer: 'DHCP 规定客户端可以暂用 0.0.0.0 作为源 IP，并通过 IP 和 MAC 广播寻找服务器，因此不要求预先拥有能够正常单播的地址。',
      noteTitle: 'DHCP 与网络接入',
      noteCopy: '关注 DORA、广播地址以及主机最终获得的网络参数。'
    },
    {
      kicker: 'STEP 02 · 应用层准备',
      title: '浏览器解析 URL',
      progressTitle: 'URL：明确访问对象、资源路径与服务类型',
      layer: 'application',
      layerBadge: '应用层 · 浏览器',
      packet: '尚未发包',
      position: '2%',
      path: '2%',
      motion: 'local',
      devices: ['client'],
      summary: '用户输入网址后，浏览器先在本机拆分协议、域名、端口和资源路径，此时还没有数据离开主机。',
      state: ['URL 与浏览器内部状态', '域名 + 资源路径', '浏览器进程', '应用自身检查输入与缓存'],
      event: [
        '浏览器从 URL 中提取协议、域名、可选端口和资源路径。',
        '服务类型决定后续通常使用的传输协议与默认端口。',
        '随后检查浏览器缓存、本机缓存以及是否已经存在可复用连接。'
      ],
      packetChange: [
        '这一步主要发生在应用内部，<strong>尚未形成需要跨网络传输的数据单元</strong>。',
        '域名只是便于人使用的资源标识，还不能直接用于 IP 路由。',
        '资源路径会进入后续 HTTP 请求，域名则先交给 DNS 解析。'
      ],
      exam: [
        '不要把“输入 URL”直接等同于“立刻发送 HTTP 请求”。',
        '若没有服务器 IP，通常要先完成 DNS；若没有连接，还要先建立 TCP。',
        '默认端口只是在 URL 未显式指定端口时采用。'
      ],
      question: '输入 URL 后，为什么通常不能马上发送 HTTP 请求？',
      answer: '浏览器通常还需要先得到服务器 IP；若没有可复用连接，还要完成 TCP 握手。只有名字解析和进程间连接准备完成，HTTP 请求才有明确的目的地和承载方式。',
      noteTitle: 'URL 到网页显示',
      noteCopy: '把浏览器本地准备、DNS、TCP 与 HTTP 的先后关系连起来。'
    },
    {
      kicker: 'STEP 03 · 名字变地址',
      title: 'DNS 解析服务器 IP',
      progressTitle: 'DNS：把域名转换为可路由的 IP 地址',
      layer: 'application',
      layerBadge: '应用层 · DNS',
      packet: 'DNS 查询',
      position: '25%',
      path: '28%',
      motion: 'dns',
      devices: ['client', 'switch', 'router', 'internet', 'dns'],
      summary: '浏览器依次检查缓存，未命中时向本地域名服务器查询，最终获得 Web 服务器的 IP 地址。',
      state: ['DNS 查询与响应', '域名 → DNS 服务器 IP', '主机、网关、DNS 服务器', '超时重试或改用其他 DNS'],
      event: [
        '先检查浏览器、本机与本地域名服务器缓存。',
        '缓存未命中时，本地域名服务器继续递归或迭代查询。',
        '得到 Web 服务器 IP 后，结果按照记录的 TTL 进行缓存。'
      ],
      packetChange: [
        'DNS 查询本身也是一次应用通信，通常装入 UDP 数据报，再经过 IP 和链路层。',
        '若 DNS 服务器不在本地子网，主机发送帧时使用的是<strong>默认网关 MAC</strong>。',
        'DNS 返回的是服务器 IP，不会返回服务器跨网络可直接使用的 MAC。'
      ],
      exam: [
        '递归查询与迭代查询要看“被询问服务器是否代替请求者继续查询”。',
        'DNS 缓存的 TTL 与 IP 分组首部的 TTL 不是同一个概念。',
        'DNS 不在五层模型之外，它也要完整经过下层协议栈。'
      ],
      question: 'DNS 服务器位于其他网络时，主机应该解析谁的 MAC 地址？',
      answer: '解析默认网关的 MAC。DNS 服务器是最终 IP 目的地，但当前以太网帧只需要送到本地链路的下一跳。',
      noteTitle: 'DNS 查询、缓存与层次结构',
      noteCopy: '关注递归与迭代、缓存 TTL，以及 DNS 查询自身如何发出。'
    },
    {
      kicker: 'STEP 04 · 进程间连接',
      title: 'TCP 三次握手',
      progressTitle: 'TCP：建立浏览器进程到 Web 进程的可靠连接',
      layer: 'transport',
      layerBadge: '传输层 · TCP',
      packet: 'SYN / ACK',
      position: '34%',
      path: '92%',
      motion: 'handshake',
      devices: ['client', 'switch', 'router', 'internet', 'server'],
      summary: 'IP 找到服务器主机，端口找到其中的 Web 进程；TCP 通过三次握手同步序号并建立连接。',
      state: ['TCP 控制报文段', '源/目的端口 + 源/目的 IP', '两端主机的 TCP', 'TCP 计时器、重传与状态机'],
      event: [
        '浏览器使用临时源端口，服务器监听 Web 服务端口。',
        '客户端发送 SYN，服务器返回 SYN + ACK，客户端再发送 ACK。',
        '双方确认收发能力，并同步各自的初始序号。'
      ],
      packetChange: [
        'TCP 首部加入源端口、目的端口、序号、确认号和控制位。',
        'SYN 会消耗一个序号；不携带数据的纯 ACK 通常不消耗序号。',
        '四元组共同区分一条 TCP 连接，而不仅是“一个端口”。'
      ],
      exam: [
        '第三次握手<strong>可以</strong>携带应用数据，但不能说成一定携带 HTTP 请求。',
        '确认号表示下一次期望收到的序号，不是已经收到的最后一个序号。',
        '三次握手与四次挥手解决的问题不同，不能只按报文数量死记。'
      ],
      question: '为什么 TCP 仅靠两次握手不能可靠地建立双向连接？',
      answer: '两次交互只能让一方确认自己的发送和对方的接收能力；第三次确认让服务器知道客户端已经收到它的 SYN 与初始序号，也能避免旧连接请求造成误建立。',
      noteTitle: 'TCP 连接管理',
      noteCopy: '关注三次握手的目的、序号变化与四元组。'
    },
    {
      kicker: 'STEP 05 · 应用报文',
      title: '浏览器构造 HTTP 请求',
      progressTitle: 'HTTP：说明要获取哪个资源',
      layer: 'application',
      layerBadge: '应用层 · HTTP/1.1',
      packet: 'HTTP GET',
      position: '5%',
      path: '8%',
      motion: 'application',
      devices: ['client'],
      summary: '连接建立后，浏览器生成请求行、首部和可选实体主体，再把这段应用数据交给 TCP。',
      state: ['HTTP 请求报文', 'URL、Host 与服务端口', '浏览器进程', '依赖 TCP 提供可靠字节流'],
      event: [
        '请求行描述方法、资源路径和 HTTP 版本。',
        '请求首部携带 Host、连接方式、可接受内容等信息。',
        'HTTP 将完整请求交给下方的 TCP，不负责选择网络路径。'
      ],
      packetChange: [
        'HTTP 请求此时是 TCP 字节流的一部分，还没有 IP 首部或 MAC 首部。',
        '应用层关心“请求什么”，端口、IP 与 MAC 分别由后续层次处理。',
        '若请求较大，TCP 可以把字节流划分到多个报文段中。'
      ],
      exam: [
        'HTTP 无状态不等于 TCP 无连接，两个协议所处层次与职责不同。',
        '持续连接、非持续连接会影响建立 TCP 连接的次数和 RTT 计算。',
        'HTTP/1.1 + TCP 是本页主线；HTTPS、HTTP/3 暂不混入第一版。'
      ],
      question: 'HTTP 请求中的 Host、目的 IP 和目的 MAC 分别解决什么问题？',
      answer: 'Host 标识应用层要访问的虚拟主机，目的 IP 标识最终服务器，目的 MAC 标识当前链路的下一跳。三者处于不同层次，不能互相替代。',
      noteTitle: 'HTTP 报文与连接方式',
      noteCopy: '关注请求报文结构、持续连接及常见 RTT 计算。'
    },
    {
      kicker: 'STEP 06 · 主机到主机',
      title: '生成 IP 分组并判断下一跳',
      progressTitle: '网络层：确定最终主机与离开本网络的方向',
      layer: 'network',
      layerBadge: '网络层 · IPv4',
      packet: 'IP 分组',
      position: '10%',
      path: '12%',
      motion: 'encapsulate',
      devices: ['client', 'router'],
      summary: 'TCP 报文段被装入 IP 分组；主机根据目的 IP 和子网掩码判断是直接交付，还是交给默认网关。',
      state: ['IPv4 分组', '最终源 IP → 最终目的 IP', '用户主机的网络层', 'ICMP 报错；上层决定是否重传'],
      event: [
        '加入源 IP、目的 IP、TTL、协议号等 IPv4 首部字段。',
        '用本机掩码判断目的 IP 是否与自己属于同一子网。',
        '不同子网时，把默认网关选为下一跳。'
      ],
      packetChange: [
        'TCP 报文段成为 IP 分组的数据部分。',
        'IP 首部的目的地址始终指向最终 Web 服务器，而不是当前路由器。',
        '协议字段表明 IP 分组携带的是 TCP，便于接收端向上分用。'
      ],
      exam: [
        '“目的 IP 在外网”时，IP 目的地址仍写最终服务器，不能改写成默认网关。',
        '下一跳与最终目的主机是两个概念。',
        '超过 MTU 时是否分片要结合 IPv4/IPv6、DF 标志和题目条件判断。'
      ],
      question: '目的主机不在本地子网时，IP 目的地址为什么仍然写最终服务器？',
      answer: 'IP 首部描述端到端的最终目标；默认网关只是当前下一跳，它由链路层目的 MAC 和本机转发表体现。普通路由器不会把最终目的 IP 改成自己。',
      noteTitle: 'IPv4、子网判断与默认网关',
      noteCopy: '关注 IP 首部、同网段判断、MTU 与分片。'
    },
    {
      kicker: 'STEP 07 · 相邻节点',
      title: 'ARP 获得下一跳 MAC 并封帧',
      progressTitle: 'ARP 与以太网：把 IP 分组交给当前链路的下一站',
      layer: 'link',
      layerBadge: '数据链路层 · 以太网',
      packet: '以太网帧',
      position: '18%',
      path: '20%',
      motion: 'link',
      devices: ['client', 'switch', 'router', 'peer', 'dhcp'],
      summary: '主机已经知道下一跳 IP，但在当前局域网发送帧还需要对应的 MAC 地址，因此先查询 ARP 缓存或广播请求。',
      state: ['以太网帧', '本机 MAC → 默认网关 MAC', '主机网卡、默认网关接口', 'FCS 检错；错误帧被丢弃'],
      event: [
        '查询 ARP 缓存，未命中时在本地广播 ARP 请求。',
        '默认网关单播返回自己的 MAC 地址，主机保存映射。',
        'IP 分组被装入以太网帧，并在帧尾加入 FCS。'
      ],
      packetChange: [
        '帧首部写本机源 MAC 与默认网关目的 MAC。',
        '帧的数据部分仍是指向最终服务器的完整 IP 分组。',
        'MAC 解决当前一跳，IP 解决端到端目标。'
      ],
      exam: [
        'ARP 查询的是<strong>下一跳 IP 对应的 MAC</strong>，不一定是最终服务器 MAC。',
        'ARP 广播只能在当前广播域中传播，路由器通常不会转发。',
        'FCS 负责检测当前帧传输差错，不等于 TCP 的端到端可靠传输。'
      ],
      question: '为什么帧的目的 MAC 是网关，而 IP 分组的目的 IP 是 Web 服务器？',
      answer: 'MAC 地址只负责当前局域网的一跳交付，IP 地址负责跨越多段链路找到最终主机。每到一个路由器，旧帧被拆除并换上下一段链路的新 MAC 首部。',
      noteTitle: 'ARP、以太网帧与逐跳寻址',
      noteCopy: '这是理解 IP 与 MAC 分工的核心停靠点。'
    },
    {
      kicker: 'STEP 08 · 真实发送',
      title: '帧被转换成比特与信号',
      progressTitle: '物理层：让抽象帧真正通过传输介质',
      layer: 'physical',
      layerBadge: '物理层 · 信号与信道',
      packet: '比特流',
      position: '25%',
      path: '30%',
      motion: 'signal',
      devices: ['client', 'switch'],
      summary: '网卡把帧转换为比特序列，再通过编码或调制变为能够在双绞线、光纤或无线信道中传播的信号。',
      state: ['比特流与物理信号', '物理接口与传播方向', '网卡、传输介质', '物理层不负责端到端重传'],
      event: [
        '帧被表示为连续的 0 和 1。',
        '编码或调制决定比特如何映射为信号。',
        '信号经过当前传输介质，到达相邻设备接口。'
      ],
      packetChange: [
        '物理层不理解 HTTP、端口、IP 或 MAC 的语义。',
        '它只按照接口规则传输比特所对应的信号。',
        '信道带宽、噪声和码元种类会限制最大数据率。'
      ],
      exam: [
        '奈氏准则用于理想低通信道，香农定理考虑噪声与信噪比。',
        '信息传输速率与码元传输速率不能直接混为同一个量。',
        'CSMA/CD 与 CSMA/CA 属于介质访问控制，不要仅因出现“信号”就归到物理层。'
      ],
      question: '奈氏准则和香农定理分别限制信道的哪一方面？',
      answer: '奈氏准则讨论理想低通信道中带宽和码元种类对最高码元或数据率的限制；香农定理进一步考虑噪声，用带宽和信噪比给出信道容量上限。',
      noteTitle: '信号、编码与信道极限',
      noteCopy: '关注码元、数据率、奈氏准则与香农定理。'
    },
    {
      kicker: 'STEP 09 · 局域网转发',
      title: '交换机根据 MAC 表转发',
      progressTitle: '交换机：在当前局域网内选择正确输出端口',
      layer: 'link',
      layerBadge: '数据链路层 · 二层交换',
      packet: '以太网帧',
      position: '38%',
      path: '44%',
      motion: 'switch',
      devices: ['switch', 'router'],
      summary: '交换机学习源 MAC 所在端口，再查询目的 MAC；已知时定向转发，未知时在相关端口泛洪。',
      state: ['以太网帧', '源 MAC、目的 MAC', '二层交换机', 'FCS 检错；上层处理丢失'],
      event: [
        '交换机从收到帧的端口学习源 MAC。',
        '查询 MAC 地址表，确定目的 MAC 对应的输出端口。',
        '表项未知时泛洪，但不会把帧发回进入端口。'
      ],
      packetChange: [
        '普通二层交换机转发时不会拆出并修改 IP 分组。',
        '交换式以太网中，每个交换机端口通常形成独立冲突域。',
        '广播域是否被分隔要看 VLAN 或三层设备，而不是仅看交换机数量。'
      ],
      exam: [
        'MAC 表根据<strong>源 MAC</strong>学习，根据目的 MAC 查询转发。',
        '未知单播与广播都会泛洪，但概念不能混写。',
        '交换机隔离冲突域；普通二层交换机默认不隔离广播域。'
      ],
      question: '交换机为什么根据源 MAC 学习，却根据目的 MAC 转发？',
      answer: '收到帧的端口直接证明了源 MAC 位于哪里，因此可以据此学习；要决定帧从哪个端口离开，则必须查询目的 MAC 的位置。',
      noteTitle: '交换机自学习与局域网',
      noteCopy: '关注 MAC 表、泛洪、冲突域与广播域。'
    },
    {
      kicker: 'STEP 10 · 跨网络转发',
      title: '路由器逐跳重新封帧',
      progressTitle: '路由器：拆除旧帧，查表并为下一段链路重新封装',
      layer: 'network',
      layerBadge: '网络层 · 分组转发',
      packet: 'IP 分组',
      position: '66%',
      path: '84%',
      motion: 'route',
      devices: ['router', 'internet', 'server'],
      summary: '每个路由器只决定下一跳：去掉旧链路的帧，检查 IP 与 TTL，最长前缀匹配，然后封装新的链路层帧。',
      state: ['IP 分组 + 每跳新帧', 'IP 通常不变；MAC 每跳改变', '沿途路由器', 'TTL 到零时发送 ICMP 超时'],
      event: [
        '路由器检查并去掉收到帧的链路层首尾部。',
        'TTL 减一，重新计算 IPv4 首部校验和，再进行最长前缀匹配。',
        '确定输出接口和下一跳后，为新的链路重新封装帧。'
      ],
      packetChange: [
        '源、目的 MAC 随链路改变；源、目的 IP 在普通转发中通常保持不变。',
        'TTL 每经过一个路由器减一，IPv4 首部校验和随之变化。',
        '若经过 NAT，IP 和端口也可能被修改并记录映射。'
      ],
      exam: [
        '最长前缀匹配选择的是匹配位数最多的表项，不是数值最大或路由最短。',
        '路由表/转发表中的下一跳可能仍需 ARP 转换为当前链路的 MAC。',
        '路由器不会为每个转发分组重新执行 TCP 或 HTTP。'
      ],
      question: '经过普通路由器时，哪些字段会改变，哪些通常保持不变？',
      answer: '源、目的 MAC 每跳改变，TTL 减一，IPv4 首部校验和随之重算；源、目的 IP 与 TCP 端口通常保持不变。NAT 是会修改 IP 或端口的重要例外。',
      noteTitle: '路由器转发与最长前缀匹配',
      noteCopy: '关注拆帧、TTL、转发表、重新封帧与 NAT 例外。'
    },
    {
      kicker: 'STEP 11 · 到达目的主机',
      title: '服务器逐层解封装',
      progressTitle: '接收端：从信号恢复到 Web 进程可读的 HTTP 请求',
      layer: 'application',
      layerBadge: '接收端 · 反向解封装',
      packet: 'HTTP 请求',
      position: '92%',
      path: '96%',
      motion: 'decapsulate',
      devices: ['server'],
      summary: '服务器按物理层、链路层、网络层、传输层和应用层的顺序逐层处理，最终根据端口把字节流交给 Web 进程。',
      state: ['HTTP 请求', 'MAC → IP → 端口逐层分用', '服务器完整协议栈', 'FCS、校验和、TCP 排序与重传'],
      event: [
        '物理层恢复比特，链路层识别帧并检查 FCS。',
        '网络层确认目的 IP，传输层校验、排序并重组字节流。',
        'TCP 根据目的端口，把数据交给监听的 Web 服务进程。'
      ],
      packetChange: [
        '解封装不是“把所有首部一次性删除”，而是每层验证并消费属于自己的控制信息。',
        '协议号帮助 IP 向 TCP 分用，目的端口帮助 TCP 向 Web 进程分用。',
        '中间路由器只处理下三层；服务器实现完整协议栈。'
      ],
      exam: [
        '服务器重组 TCP 字节流，与 IPv4 分片重组是两个不同层次的问题。',
        'FCS 正确不能推出数据一定完整到达应用，端到端可靠性仍由 TCP 负责。',
        '端口标识进程，IP 标识主机或接口，MAC 服务当前链路。'
      ],
      question: '接收端如何利用协议号和目的端口把数据交给正确进程？',
      answer: 'IP 首部协议号把数据分用给 TCP，TCP 首部目的端口再把重组后的字节流分用给正在监听该端口的 Web 进程。',
      noteTitle: '接收端分用与逐层解封装',
      noteCopy: '把“数据名称变化”和“逐层分用依据”对应起来。'
    },
    {
      kicker: 'STEP 12 · 返回与结束',
      title: 'HTTP 响应返回并显示网页',
      progressTitle: '响应：沿相反方向返回，浏览器继续加载页面资源',
      layer: 'application',
      layerBadge: '应用层 · 响应与连接释放',
      packet: 'HTTP 响应',
      position: '52%',
      path: '100%',
      motion: 'response',
      devices: ['client', 'switch', 'router', 'internet', 'server'],
      summary: '服务器生成 HTTP 响应并沿相反方向返回；浏览器解析 HTML，继续请求 CSS、脚本和图片，最后复用或释放连接。',
      state: ['HTTP 响应与后续资源请求', '服务器端口 → 客户端临时端口', 'Web 服务器、浏览器', 'TCP 确认、重传与连接释放'],
      event: [
        '服务器返回状态行、首部和所请求的资源。',
        '浏览器解析 HTML，并按需要继续请求 CSS、JavaScript 和图片。',
        '连接可以被复用；通信结束后通过四次挥手释放 TCP。'
      ],
      packetChange: [
        '返回方向的源、目的 IP 与端口和请求方向相反。',
        '响应仍会依次经历 TCP、IP、链路层和物理层。',
        '持续连接能够减少重复建立 TCP 连接带来的 RTT。'
      ],
      exam: [
        '网页显示通常不只对应一个 HTTP 请求，HTML 还可能引用多个外部资源。',
        '非持续连接、持续连接与流水线的 RTT 计算要分别建模。',
        '主动关闭的一方进入 TIME-WAIT，作用不能只解释为“等待服务器关闭”。'
      ],
      question: '为什么收到 HTML 不一定意味着网页所需的网络通信已经全部完成？',
      answer: 'HTML 往往只描述页面结构，还引用 CSS、JavaScript、图片等外部资源。浏览器解析后可能继续发起多个请求，并复用或新建连接。',
      noteTitle: 'HTTP 响应、RTT 与 TCP 释放',
      noteCopy: '关注多资源加载、连接复用、四次挥手与 TIME-WAIT。'
    }
  ];

  const packetModels = [
    {
      direction: '接入阶段 · 广播封装',
      change: '主机使用特殊源地址和广播目的地址完成首次网络配置。',
      fields: [
        ['application', 'active', 'DHCP Discover', '请求 IP、掩码、网关与 DNS'],
        ['transport', 'added', 'UDP', '源端口 68 → 目的端口 67'],
        ['network', 'added', 'IPv4', '0.0.0.0 → 255.255.255.255'],
        ['link', 'added', 'Ethernet', '目的 MAC FF:FF:FF:FF:FF:FF'],
        ['physical', 'added', 'Bits', '编码后通过当前介质广播']
      ]
    },
    {
      direction: '主机内部 · 尚未发包',
      change: '浏览器只在本机拆分 URL，其他层尚未增加首部。',
      fields: [
        ['application', 'active', 'URL', 'http://study.example/index.html'],
        ['transport', 'pending', '传输层', '等待确定连接与服务端口'],
        ['network', 'pending', '网络层', '等待 DNS 返回服务器 IP'],
        ['link', 'pending', '链路层', '尚未确定本次发送的下一跳'],
        ['physical', 'pending', '物理层', '当前没有信号离开主机']
      ]
    },
    {
      direction: 'DNS 查询 · 完整跨层发送',
      change: '域名进入 DNS 问题区，下层分别加入端口、IP 与当前一跳 MAC。',
      fields: [
        ['application', 'active', 'DNS Query', 'QNAME=study.example，QTYPE=A'],
        ['transport', 'added', 'UDP', '53000 → 53'],
        ['network', 'added', 'IPv4', '192.168.31.104 → 198.51.100.53'],
        ['link', 'added', 'Ethernet', 'H1 MAC → 默认网关 MAC'],
        ['physical', 'added', 'Bits', '帧转换为信号发送']
      ]
    },
    {
      direction: 'TCP 建连 · 控制报文',
      change: 'TCP SYN 没有 HTTP 数据，但依然需要 IP、帧与物理层承载。',
      fields: [
        ['application', 'pending', '应用数据', '尚未发送 HTTP 请求'],
        ['transport', 'active', 'TCP SYN', '49152 → 80，SYN=1，Seq=x'],
        ['network', 'kept', 'IPv4', '192.168.31.104 → 203.0.113.20'],
        ['link', 'kept', 'Ethernet', 'H1 MAC → 默认网关 MAC'],
        ['physical', 'kept', 'Bits', '控制报文段随帧发送']
      ]
    },
    {
      direction: '发送端 · 逐层封装',
      change: 'HTTP 请求成为 TCP 字节流的一部分，随后继续加入 IP 与链路层首尾部。',
      fields: [
        ['application', 'active', 'HTTP GET', 'GET /index.html，Host: study.example'],
        ['transport', 'added', 'TCP', '49152 → 80，Seq=x+1，ACK=1'],
        ['network', 'added', 'IPv4', '192.168.31.104 → 203.0.113.20'],
        ['link', 'added', 'Ethernet', 'H1 MAC → 默认网关 MAC，Type=IPv4'],
        ['physical', 'added', 'Bits', '完整帧编码后发送']
      ]
    },
    {
      direction: '网络层 · 加入端到端地址',
      change: '目的 IP 始终写最终服务器；默认网关只作为下一跳，不会替代它。',
      fields: [
        ['application', 'kept', 'HTTP GET', '应用报文保持不变'],
        ['transport', 'kept', 'TCP', '49152 → 80'],
        ['network', 'active', 'IPv4', 'Src=192.168.31.104，Dst=203.0.113.20，TTL=64'],
        ['link', 'pending', 'Ethernet', '等待 ARP 得到下一跳 MAC'],
        ['physical', 'pending', 'Bits', '尚未交给物理接口']
      ]
    },
    {
      direction: '当前链路 · ARP 后完成封帧',
      change: 'ARP 广播先获得网关 MAC；随后 IP 分组才能装入发往网关的以太网帧。',
      fields: [
        ['application', 'kept', 'HTTP GET', '封装在最内层'],
        ['transport', 'kept', 'TCP', '49152 → 80'],
        ['network', 'kept', 'IPv4', '最终目的仍为 203.0.113.20'],
        ['link', 'active', 'Ethernet', '02:00:00:00:01:04 → 02:00:00:00:01:01 + FCS'],
        ['physical', 'pending', 'Bits', '下一步开始编码发送']
      ]
    },
    {
      direction: '物理层 · 帧变成信号',
      change: '上层首部不会消失，完整帧只是被表示为连续比特并映射为物理信号。',
      fields: [
        ['application', 'kept', 'HTTP GET', '仍位于有效载荷内部'],
        ['transport', 'kept', 'TCP', '首部与字节流保持'],
        ['network', 'kept', 'IPv4', 'IP 分组保持'],
        ['link', 'kept', 'Ethernet', '帧首尾部保持'],
        ['physical', 'active', 'Bits / Signal', '0110… → 编码或调制后的信号']
      ]
    },
    {
      direction: '交换机 · 按帧转发',
      change: '交换机读取源、目的 MAC 并选择端口，通常不修改帧内的 IP 与 TCP 字段。',
      fields: [
        ['application', 'kept', 'HTTP GET', '交换机不读取'],
        ['transport', 'kept', 'TCP', '交换机不读取'],
        ['network', 'kept', 'IPv4', '普通二层交换机不修改'],
        ['link', 'active', 'Ethernet', '查询 Dst MAC，学习 Src MAC'],
        ['physical', 'changed', 'Port', '从入端口恢复帧，再从出端口发送']
      ]
    },
    {
      direction: '路由器 · 拆旧帧再重新封帧',
      change: '旧 MAC 首部被替换，TTL 从 64 变为 63；IP 地址和 TCP 端口通常保持。',
      fields: [
        ['application', 'kept', 'HTTP GET', '路由器不处理应用语义'],
        ['transport', 'kept', 'TCP', '49152 → 80'],
        ['network', 'changed', 'IPv4', 'Src/Dst 不变，TTL 64 → 63，重算首部校验和'],
        ['link', 'changed', 'New Ethernet', 'R1 出接口 MAC → R2 接口 MAC'],
        ['physical', 'changed', 'New Link Bits', '按下一段链路重新发送']
      ]
    },
    {
      direction: '接收端 · 逐层解封装',
      change: '每层先校验并读取自己的控制信息，再把有效载荷向上交付。',
      fields: [
        ['application', 'active', 'HTTP GET', '最终交给监听 80 端口的 Web 进程'],
        ['transport', 'removed', 'TCP', '校验、排序、确认后去除首部'],
        ['network', 'removed', 'IPv4', '确认目的 IP、根据协议号交给 TCP'],
        ['link', 'removed', 'Ethernet', '检查目的 MAC 与 FCS 后去除帧首尾'],
        ['physical', 'removed', 'Bits', '信号首先恢复为比特流']
      ]
    },
    {
      direction: '返回方向 · 地址与端口对调',
      change: '服务器生成 HTTP 200 响应，源/目的端口和 IP 与请求方向相反，再沿路径返回。',
      fields: [
        ['application', 'active', 'HTTP/1.1 200 OK', 'HTML + 后续资源描述'],
        ['transport', 'changed', 'TCP', '80 → 49152，Seq=y，ACK=x+n'],
        ['network', 'changed', 'IPv4', '203.0.113.20 → 192.168.31.104'],
        ['link', 'changed', 'Ethernet', '每一跳重新填写当前链路 MAC'],
        ['physical', 'changed', 'Bits', '沿返回链路逐跳发送']
      ]
    }
  ];

  const layerOverviews = {
    application: {
      kicker: 'LAYER OVERVIEW · APPLICATION',
      title: '应用层：明确要访问什么',
      focusTitle: '应用层 · 应用进程之间',
      focusCopy: '端到端只表达“要交换什么内容”。中间交换机和路由器不会理解 HTTP、DNS 的应用语义。',
      event: ['直接服务浏览器、DNS 客户端和 Web 服务器等应用进程。', '定义应用报文的语义、格式与交换顺序。', '在本流程中承担 URL、DNS 与 HTTP 三个主要停靠点。'],
      packetChange: ['本层数据通常称为应用报文。', '域名、URL、HTTP 方法等属于应用语义。', '应用报文交给 TCP 或 UDP 后，才继续增加下层首部。'],
      exam: ['DNS、HTTP、FTP 与电子邮件协议的传输层选择不同。', '应用层“直接服务用户”不等于协议由用户手工执行。', '网络应用模型 C/S 与 P2P 是组织方式，不是新的协议层。'],
      question: '应用层决定“传什么”，但为什么不负责选择路由？',
      answer: '应用层定义业务语义和报文，路由属于网络层的跨网络交付职责。分层让应用不必理解每一台中间路由器和每段链路。',
      noteTitle: '应用层总览',
      noteCopy: 'DNS、HTTP、FTP、邮件与网络应用模型。'
    },
    transport: {
      kicker: 'LAYER OVERVIEW · TRANSPORT',
      title: '传输层：把数据交给正确进程',
      focusTitle: '传输层 · 端到端进程通信',
      focusCopy: 'TCP 或 UDP 只在端系统处理。沿途设备转发下层数据，不维护这条应用进程间的通信语义。',
      event: ['只运行在端系统，为不同主机上的应用进程提供逻辑通信。', '使用端口完成复用与分用。', 'TCP 提供可靠字节流，UDP 提供轻量的无连接报文服务。'],
      packetChange: ['TCP 加入端口、序号、确认号、窗口与控制位。', 'UDP 保留较小的首部并维持应用报文边界。', '传输层数据会成为 IP 分组的数据部分。'],
      exam: ['实际 TCP 发送窗口受接收窗口和拥塞窗口共同限制。', 'TCP 面向字节流，没有应用报文边界。', '端口号只能在主机内部标识进程，不能代替 IP 地址。'],
      question: 'IP 已经找到服务器，为什么还需要端口号？',
      answer: '一台主机可以同时运行多个网络进程，IP 只能定位主机或接口，端口才能让传输层把数据交给正确应用。',
      noteTitle: '传输层总览',
      noteCopy: '端口、UDP、TCP 连接管理、可靠传输、流量与拥塞控制。'
    },
    network: {
      kicker: 'LAYER OVERVIEW · NETWORK',
      title: '网络层：跨越多个网络找到主机',
      focusTitle: '网络层 · 主机到主机',
      focusCopy: 'IP 目的地址指向最终主机；路由器沿途逐跳读取目的 IP、递减 TTL，并选择下一跳。',
      event: ['把 IP 分组从源主机送到目的主机。', '主机先判断同网段或默认网关，路由器再逐跳查询转发表。', 'IP 提供尽最大努力的无连接数据报服务。'],
      packetChange: ['源、目的 IP 通常端到端保持不变。', 'TTL 在每个路由器处减一。', 'NAT、IPv4 分片和 ICMP 是主线中的重要例外或辅助机制。'],
      exam: ['最长前缀匹配、子网划分和分片经常进入综合题。', '路由选择计算路径，分组转发执行下一跳选择。', 'ARP 在 408 知识结构中常放网络层，但它只服务当前局域网。'],
      question: '网络层为何只保证尽最大努力交付，而可靠性放在 TCP？',
      answer: '保持网络核心简单能提高扩展性和转发效率；需要可靠性的应用可由端系统中的 TCP 端到端实现，不需要每台路由器维护连接状态。',
      noteTitle: '网络层总览',
      noteCopy: 'IPv4/IPv6、ARP、DHCP、ICMP、NAT 与路由选择。'
    },
    link: {
      kicker: 'LAYER OVERVIEW · DATA LINK',
      title: '数据链路层：通过当前一段链路',
      focusTitle: '数据链路层 · 相邻节点之间',
      focusCopy: '一次只跨过一段链路。经过路由器后，旧帧结束，下一段链路会换上新的源、目的 MAC。',
      event: ['把 IP 分组封装成帧，交付给相邻节点。', '使用 MAC 地址完成当前广播域中的转发。', '处理成帧、透明传输、检错与介质访问控制。'],
      packetChange: ['加入源/目的 MAC、类型与帧尾 FCS。', '路由器每经过一条新链路都要重新封装新的帧。', '交换机通常不修改帧内 IP 分组。'],
      exam: ['CRC 能检错，但并不自动完成重传。', '交换机隔离冲突域，VLAN 或路由设备划分广播域。', 'CSMA/CD 与 CSMA/CA 的适用场景和退避规则不同。'],
      question: '为什么同一个 IP 分组在不同链路上会拥有不同的 MAC 首部？',
      answer: '每段链路只认识本段的发送接口与下一跳接口。路由器拆除到达链路的帧，再按照下一段链路的协议和地址重新封装。',
      noteTitle: '数据链路层总览',
      noteCopy: '封装成帧、CRC、可靠传输、介质访问、以太网与 VLAN。'
    },
    physical: {
      kicker: 'LAYER OVERVIEW · PHYSICAL',
      title: '物理层：真正传输比特',
      focusTitle: '物理层 · 接口到接口',
      focusCopy: '帧被编码或调制为信号，只在当前介质上传播到相邻接口；这一层看见的是比特，不是 HTTP 或 IP。',
      event: ['规定机械、电气、功能和过程等接口特性。', '通过编码或调制把比特映射为可传播的信号。', '使用双绞线、光纤或无线介质完成相邻节点间的物理传输。'],
      packetChange: ['本层处理的是比特与信号，不解释上层字段含义。', '不同编码方案会影响同步、带宽需求和抗干扰能力。', '复用允许多路信号共享一条物理信道。'],
      exam: ['奈氏准则、香农定理、编码与复用是典型计算或判断点。', '带宽在模拟与数字语境中的单位和含义需要区分。', '中继器和集线器工作在物理层，不学习 MAC 地址。'],
      question: '物理层只传比特，为什么仍需要复杂的编码、调制和复用？',
      answer: '真实介质只能传播物理信号。编码和调制决定如何表示比特并适应信道，复用则让多路通信更有效地共享有限介质。',
      noteTitle: '物理层总览',
      noteCopy: '信号、信道、编码、调制、传输介质与信道极限。'
    }
  };

  const elements = {
    stageButtons: Array.from(root.querySelectorAll('[data-stage-button]')),
    phaseCards: Array.from(root.querySelectorAll('[data-phase-card]')),
    phaseButtons: Array.from(root.querySelectorAll('[data-phase-jump]')),
    tabButtons: Array.from(root.querySelectorAll('[data-detail-tab]')),
    phaseCounter: root.querySelector('[data-phase-counter]'),
    counter: root.querySelector('[data-stage-counter]'),
    progressTitle: root.querySelector('[data-progress-title]'),
    percent: root.querySelector('[data-progress-percent]'),
    progressBar: root.querySelector('[data-progress-bar]'),
    stageKicker: root.querySelector('[data-stage-kicker]'),
    stageTitle: root.querySelector('[data-stage-title]'),
    stageSummary: root.querySelector('[data-stage-summary]'),
    layerBadge: root.querySelector('[data-layer-badge]'),
    packet: root.querySelector('[data-packet]'),
    packetName: root.querySelector('[data-packet-name]'),
    topology: root.querySelector('[data-topology]'),
    pathProgress: root.querySelector('[data-path-progress]'),
    packetDirection: root.querySelector('[data-packet-direction]'),
    envelope: root.querySelector('[data-envelope]'),
    fieldChange: root.querySelector('[data-field-change]'),
    devices: Array.from(root.querySelectorAll('[data-device]')),
    state: [
      root.querySelector('[data-state-data]'),
      root.querySelector('[data-state-address]'),
      root.querySelector('[data-state-device]'),
      root.querySelector('[data-state-safety]')
    ],
    detailKicker: root.querySelector('[data-detail-kicker]'),
    detailTitle: root.querySelector('[data-detail-title]'),
    detailContent: root.querySelector('[data-detail-content]'),
    question: root.querySelector('[data-question]'),
    answer: root.querySelector('[data-answer]'),
    revealAnswer: root.querySelector('[data-reveal-answer]'),
    noteTitle: root.querySelector('[data-note-title]'),
    noteCopy: root.querySelector('[data-note-copy]'),
    prev: root.querySelector('[data-control="prev"]'),
    play: root.querySelector('[data-control="play"]'),
    next: root.querySelector('[data-control="next"]'),
    replay: root.querySelector('[data-control="replay"]'),
    playIcon: root.querySelector('[data-play-icon]'),
    playLabel: root.querySelector('[data-play-label]'),
    branchButtons: Array.from(root.querySelectorAll('[data-jump-stage]'))
  };

  let currentStage = 0;
  let currentTab = 'event';
  let timer = null;
  let playing = false;

  function listHtml(items) {
    return '<ol>' + items.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ol>';
  }

  function tabItems(record) {
    if (currentTab === 'packet') return record.packetChange;
    if (currentTab === 'exam') return record.exam;
    return record.event;
  }

  function renderDetail(record) {
    elements.detailKicker.textContent = record.kicker.indexOf('LAYER') === 0 ? 'LAYER OVERVIEW' : 'PAUSE & INSPECT';
    elements.detailTitle.textContent = record.title;
    elements.detailContent.innerHTML = listHtml(tabItems(record));
    elements.question.textContent = record.question;
    elements.noteTitle.textContent = record.noteTitle;
    elements.noteCopy.textContent = record.noteCopy;
  }

  function resetAnswer(record) {
    elements.answer.textContent = record.answer || '答案将在对应专题内容补齐后加入。';
    elements.answer.hidden = true;
    elements.revealAnswer.setAttribute('aria-expanded', 'false');
    elements.revealAnswer.textContent = '揭晓答案';
  }

  function restartMotion(motion) {
    elements.topology.dataset.motion = motion;
    elements.topology.classList.remove('is-motion-running');
    void elements.topology.offsetWidth;
    elements.topology.classList.add('is-motion-running');
  }

  function renderPacketModel(model) {
    const layerNames = {
      application: '应用层',
      transport: '传输层',
      network: '网络层',
      link: '链路层',
      physical: '物理层'
    };
    const statusNames = {
      active: '当前观察',
      added: '本次加入',
      kept: '保持不变',
      changed: '字段改变',
      removed: '校验后移除',
      pending: '尚未加入'
    };

    elements.packetDirection.textContent = model.direction;
    elements.fieldChange.textContent = model.change;
    elements.envelope.innerHTML = model.fields.map(function (field) {
      const layer = field[0];
      const status = field[1];
      return '<article class="nj-envelope-field is-' + status + '" data-envelope-layer="' + layer + '">' +
        '<div><span>' + layerNames[layer] + '</span><em>' + statusNames[status] + '</em></div>' +
        '<strong>' + field[2] + '</strong>' +
        '<code>' + field[3] + '</code>' +
        '</article>';
    }).join('');
  }

  function updateTabButtons() {
    elements.tabButtons.forEach(function (button) {
      const active = button.dataset.detailTab === currentTab;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
  }

  function renderStage() {
    const stage = stages[currentStage];
    const number = String(currentStage + 1).padStart(2, '0');
    const percentage = Math.round(((currentStage + 1) / stages.length) * 100);

    elements.counter.textContent = '步骤 ' + number + ' / ' + stages.length;
    elements.progressTitle.textContent = stage.progressTitle;
    elements.percent.textContent = percentage + '%';
    elements.progressBar.style.width = percentage + '%';
    elements.stageKicker.textContent = stage.kicker;
    elements.stageTitle.textContent = stage.title;
    elements.stageSummary.textContent = stage.summary;
    elements.layerBadge.textContent = stage.layerBadge;
    elements.packetName.textContent = stage.packet;
    elements.packet.style.setProperty('--packet-position', stage.position);
    elements.pathProgress.style.width = stage.path;
    root.dataset.currentStage = String(currentStage + 1);
    restartMotion(stage.motion);
    renderPacketModel(packetModels[currentStage]);

    stage.state.forEach(function (value, index) {
      elements.state[index].textContent = value;
    });

    elements.devices.forEach(function (device) {
      device.classList.toggle('is-active', stage.devices.indexOf(device.dataset.device) !== -1);
    });

    elements.stageButtons.forEach(function (button, index) {
      const active = index === currentStage;
      button.classList.toggle('is-active', active);
      button.classList.toggle('is-complete', index < currentStage);
      button.setAttribute('aria-current', active ? 'step' : 'false');
    });

    let activePhaseCard = null;
    elements.phaseCards.forEach(function (card, index) {
      const start = Number(card.dataset.phaseStart);
      const end = Number(card.dataset.phaseEnd);
      const active = currentStage >= start && currentStage <= end;
      const complete = currentStage > end;
      card.classList.toggle('is-active', active);
      card.classList.toggle('is-complete', complete);
      const heading = card.querySelector('[data-phase-jump]');
      if (heading) heading.setAttribute('aria-current', active ? 'step' : 'false');
      if (active) {
        activePhaseCard = card;
        elements.phaseCounter.textContent = '阶段 ' + String(index + 1).padStart(2, '0') + ' / ' + String(elements.phaseCards.length).padStart(2, '0');
      }
    });

    renderDetail(stage);
    resetAnswer(stage);
    elements.prev.disabled = currentStage === 0;
    elements.next.disabled = currentStage === stages.length - 1;

    const phaseTrack = activePhaseCard && activePhaseCard.closest('.nj-phase-track');
    if (phaseTrack) {
      const targetTop = Math.max(0, activePhaseCard.offsetTop - phaseTrack.offsetTop - 8);
      if (typeof phaseTrack.scrollTo === 'function') {
        phaseTrack.scrollTo({ top: targetTop, behavior: 'smooth' });
      } else {
        phaseTrack.scrollTop = targetTop;
      }
    }
  }

  function setStage(index, shouldPause) {
    if (index < 0 || index >= stages.length) return;
    if (shouldPause) pause();
    currentStage = index;
    renderStage();
  }

  function updatePlayButton() {
    root.classList.toggle('is-playing', playing);
    elements.play.setAttribute('aria-pressed', String(playing));
    elements.playIcon.textContent = playing ? 'Ⅱ' : '▶';
    elements.playLabel.textContent = playing ? '暂停播放' : '自动播放';
  }

  function pause() {
    if (timer) window.clearInterval(timer);
    timer = null;
    playing = false;
    updatePlayButton();
  }

  function play() {
    if (currentStage === stages.length - 1) currentStage = 0;
    playing = true;
    renderStage();
    updatePlayButton();
    timer = window.setInterval(function () {
      if (currentStage >= stages.length - 1) {
        pause();
        return;
      }
      currentStage += 1;
      renderStage();
    }, 5200);
  }

  function togglePlay() {
    if (playing) pause();
    else play();
  }

  elements.stageButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      setStage(Number(button.dataset.stageButton), true);
    });
  });

  elements.phaseButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      setStage(Number(button.dataset.phaseJump), true);
    });
  });

  elements.tabButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      currentTab = button.dataset.detailTab;
      updateTabButtons();
      renderDetail(stages[currentStage]);
    });
  });
  elements.revealAnswer.addEventListener('click', function () {
    const expanded = elements.revealAnswer.getAttribute('aria-expanded') === 'true';
    elements.revealAnswer.setAttribute('aria-expanded', String(!expanded));
    elements.revealAnswer.textContent = expanded ? '揭晓答案' : '收起答案';
    elements.answer.hidden = expanded;
  });
  elements.prev.addEventListener('click', function () { setStage(currentStage - 1, true); });
  elements.next.addEventListener('click', function () { setStage(currentStage + 1, true); });
  elements.play.addEventListener('click', togglePlay);
  elements.replay.addEventListener('click', function () { setStage(0, true); });

  elements.branchButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      setStage(Number(button.dataset.jumpStage), true);
      const workspace = root.querySelector('.nj-workspace');
      if (workspace && typeof workspace.scrollIntoView === 'function') {
        workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  document.addEventListener('keydown', function (event) {
    const target = event.target;
    if (target && /input|textarea|select|button|a/i.test(target.tagName)) return;
    if (event.key === 'ArrowLeft') setStage(currentStage - 1, true);
    if (event.key === 'ArrowRight') setStage(currentStage + 1, true);
    if (event.key === ' ') {
      event.preventDefault();
      togglePlay();
    }
  });

  updateTabButtons();
  updatePlayButton();
  renderStage();
})();
